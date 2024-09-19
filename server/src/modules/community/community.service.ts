import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryFailedError, EntityManager } from 'typeorm';
import { Community } from './entities/community.entity';
import { Comment } from './entities/comment.entity';
import { CreateCommunityDto } from './dto/create-community.dto';
import { UpdateCommunityDto } from './dto/update-community.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { PostRepository } from './repositories/post.repository';
import { CommentRepository } from './repositories/comment.repository';
import { Category } from './enums/category.enum';

@Injectable()
export class CommunityService {
  constructor(
    @InjectRepository(PostRepository)
    private readonly postRepository: PostRepository,

    @InjectRepository(CommentRepository)
    private readonly commentRepository: CommentRepository,

    private readonly dataSource: DataSource,
  ) {}

  private static readonly NO_PERMISSION_MSG = '권한이 없습니다.';
  private static readonly POST_NOT_FOUND_MSG = (id: number) => `ID가 ${id}인 게시글을 찾을 수 없습니다.`;
  private static readonly COMMENT_NOT_FOUND_MSG = (id: number) => `ID가 ${id}인 댓글을 찾을 수 없습니다.`;

  // 권한 확인 메소드
  private checkOwnership(userId: number, ownerId: number): void {
    if (userId !== ownerId) {
      throw new HttpException(CommunityService.NO_PERMISSION_MSG, HttpStatus.FORBIDDEN);
    }
  }

  // 페이지네이션을 포함한 모든 게시글 조회
  async getAllPosts(paginationQuery: PaginationQueryDto): Promise<Community[]> {
    const { page = 1, pageSize = 10 } = paginationQuery;
    const take = pageSize;
    const skip = (page - 1) * pageSize;
    return this.postRepository.find({ take, skip });
  }

  // 페이지네이션을 포함한 카테고리별 게시글 조회
  async getPostsByCategory(category: Category, paginationQuery: PaginationQueryDto): Promise<Community[]> {
    const { page = 1, pageSize = 10 } = paginationQuery;
    const take = pageSize;
    const skip = (page - 1) * pageSize;
    return this.postRepository.findByCategory(category, take, skip);
  }

  // 게시글 생성
  async createPost(createCommunityDto: CreateCommunityDto): Promise<Community> {
    try {
      const post = this.postRepository.create({ ...createCommunityDto });
      return await this.postRepository.save(post);
    } catch (error) {
      this.handleError(error);
    }
  }

  // 게시글 조회
  async getPostById(id: number): Promise<Community> {
    const post = await this.postRepository.findOne({
      where: { postId: id },
      relations: ['user'],
    });
    if (!post) {
      throw new NotFoundException(CommunityService.POST_NOT_FOUND_MSG(id));
    }
    return post;
  }

  // 게시글 수정
  async updatePost(id: number, updateCommunityDto: UpdateCommunityDto): Promise<Community> {
    try {
      const post = await this.getPostById(id);
      await this.postRepository.update(id, updateCommunityDto);
      return this.getPostById(id);
    } catch (error) {
      this.handleError(error);
    }
  }

  // 게시글 삭제
  async deletePost(id: number): Promise<void> {
    try {
      const post = await this.getPostById(id);
      const result = await this.postRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(CommunityService.POST_NOT_FOUND_MSG(id));
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  // 댓글 목록 조회 (페이징 처리)
  async getComments(postId: number, page: number, limit: number): Promise<Comment[]> {
    const take = limit;
    const skip = (page - 1) * limit;
    return this.commentRepository.find({
      where: { postId, parent: null }, // 부모 댓글만 조회
      take,
      skip,
      relations: ['user'],
    });
  }

  // 특정 댓글에 대한 대댓글 목록 조회
  async getReplies(postId: number, commentId: number): Promise<Comment[]> {
    return this.commentRepository.find({
      where: { postId, parent: { id: commentId } }, // 부모 댓글 ID로 대댓글 조회
      relations: ['user'], // 대댓글 작성자 정보 포함
    });
  }

  // 댓글 생성
  async createComment(postId: number, createCommentDto: CreateCommentDto): Promise<Comment> {
    try {
      return await this.dataSource.transaction(async (manager) => {
        const comment = manager.create(Comment, {
          ...createCommentDto,
          postId,
        });
        const savedComment = await manager.save(Comment, comment);
        await this.updatePostCommentCount(postId, manager);
        return savedComment;
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  // 댓글 수정
  async updateComment(postId: number, commentId: number, updateCommentDto: UpdateCommentDto): Promise<Comment> {
    try {
      return await this.dataSource.transaction(async (manager) => {
        const comment = await manager.findOne(Comment, {
          where: { id: commentId, postId },
          relations: ['user'],
        });

        if (!comment) {
          throw new NotFoundException(CommunityService.COMMENT_NOT_FOUND_MSG(commentId));
        }

        await manager.update(Comment, commentId, updateCommentDto);
        return manager.findOne(Comment, { where: { id: commentId } });
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  // 댓글 삭제
  async deleteComment(postId: number, commentId: number): Promise<void> {
    try {
      return await this.dataSource.transaction(async (manager) => {
        const comment = await manager.findOne(Comment, {
          where: { id: commentId, postId },
          relations: ['user'],
        });

        if (!comment) {
          throw new NotFoundException(CommunityService.COMMENT_NOT_FOUND_MSG(commentId));
        }

        const result = await manager.delete(Comment, commentId);
        if (result.affected === 0) {
          throw new NotFoundException(CommunityService.COMMENT_NOT_FOUND_MSG(commentId));
        }
        await this.updatePostCommentCount(postId, manager);
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  // 대댓글 생성
  async createReply(postId: number, parentId: number, createCommentDto: CreateCommentDto): Promise<Comment> {
    try {
      return await this.dataSource.transaction(async (manager) => {
        const reply = manager.create(Comment, {
          ...createCommentDto,
          postId,
          parent: { id: parentId },
        });
        const savedReply = await manager.save(Comment, reply);
        await this.updateReplyCount(parentId, manager);
        return savedReply;
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  // 대댓글 수정
  async updateReply(postId: number, commentId: number, updateCommentDto: UpdateCommentDto): Promise<Comment> {
    try {
      return await this.dataSource.transaction(async (manager) => {
        const reply = await manager.findOne(Comment, {
          where: { id: commentId, postId, parent: { id: commentId } },
        });

        if (!reply) {
          throw new NotFoundException(CommunityService.COMMENT_NOT_FOUND_MSG(commentId));
        }

        await manager.update(Comment, commentId, updateCommentDto);
        return manager.findOne(Comment, { where: { id: commentId } });
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  // 대댓글 삭제
  async deleteReply(postId: number, commentId: number): Promise<void> {
    try {
      return await this.dataSource.transaction(async (manager) => {
        const reply = await manager.findOne(Comment, {
          where: { id: commentId, postId },
          relations: ['parent'],
        });

        if (!reply) {
          throw new NotFoundException(CommunityService.COMMENT_NOT_FOUND_MSG(commentId));
        }

        const result = await manager.delete(Comment, commentId);
        if (result.affected === 0) {
          throw new NotFoundException(CommunityService.COMMENT_NOT_FOUND_MSG(commentId));
        }
        await this.updateReplyCount(reply.parent.id, manager);
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  // 게시글 댓글 수 업데이트
  private async updatePostCommentCount(postId: number, manager: EntityManager): Promise<void> {
    const commentCount = await manager.count(Comment, { where: { postId, parent: null } });
    await manager.update(Community, { id: postId }, { commentCount });
  }

  // 댓글의 대댓글 수 업데이트
  private async updateReplyCount(parentId: number, manager: EntityManager): Promise<void> {
    const replyCount = await manager.count(Comment, { where: { parent: { id: parentId } } });
    await manager.update(Comment, parentId, { replyCount });
  }

  // 게시글 좋아요 수 증가
  async incrementLikes(postId: number): Promise<void> {
    try {
      const post = await this.getPostById(postId);
      post.likeCount += 1;
      await this.postRepository.save(post);
    } catch (error) {
      this.handleError(error);
    }
  }

  // 게시글 좋아요 수 감소
  async decrementLikes(postId: number): Promise<void> {
    try {
      const post = await this.getPostById(postId);
      post.likeCount -= 1;
      await this.postRepository.save(post);
    } catch (error) {
      this.handleError(error);
    }
  }

  // 게시글 조회수 증가
  async incrementViews(postId: number): Promise<void> {
    try {
      const post = await this.getPostById(postId);
      post.viewCount += 1;
      await this.postRepository.save(post);
    } catch (error) {
      this.handleError(error);
    }
  }

  // 오류 처리 메소드
  private handleError(error: any): void {
    if (error instanceof QueryFailedError) {
      // SQL 오류 처리
      throw new HttpException('데이터베이스 작업 중 오류가 발생했습니다.', HttpStatus.INTERNAL_SERVER_ERROR);
    } else {
      // 기타 오류 처리
      throw new HttpException('알 수 없는 오류가 발생했습니다.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
