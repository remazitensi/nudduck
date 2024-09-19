/**
 * File Name    : community.service.ts
 * Description  : 커뮤니티 서비스
 * Author       : 김재영
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.07    김재영      Created     커뮤니티 서비스 초기 생성
 * 2024.09.09    김재영      Modified    게시글 CRUD 메서드 구현
 * 2024.09.10    김재영      Modified    댓글 관련 API 메서드 추가
 * 2024.09.10    김재영      Modified    TypeORM을 통한 데이터베이스 작업 처리 추가
 * 2024.09.11    김재영      Modified    페이지네이션 기능 추가 및 개선
 * 2024.09.12    김재영      Modified    게시글과 댓글의 대댓글 처리 로직 추가 및 리팩토링
 * 2024.09.12    김재영      Modified    좋아요 및 조회수 기능 추가
 * 2024.09.18    김재영      Modified    예외 처리 개선
 * 2024.09.19    김재영      Modified    유저 권한 추가
 */

import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';
import { Community } from './entities/community.entity';
import { Comment } from './entities/comment.entity';
import { CreateCommunityDto } from './dto/create-community.dto';
import { UpdateCommunityDto } from './dto/update-community.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { PostRepository } from './repositories/post.repository';
import { CommentRepository } from './repositories/comment.repository';
import { UserRepository } from '@_modules/user/user.repository';
import { Category } from './enums/category.enum';
import { User } from '@_modules/user/entity/user.entity';

@Injectable()
export class CommunityService {
  constructor(
    @InjectRepository(PostRepository)
    private readonly postRepository: PostRepository,

    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,

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
    return this.postRepository.findAll(paginationQuery);
  }

  // 페이지네이션을 포함한 카테고리별 게시글 조회
  async getPostsByCategory(category: Category, paginationQuery: PaginationQueryDto): Promise<Community[]> {
    return this.postRepository.findByCategory(category, paginationQuery);
  }

  // 게시글 생성
  async createPost(userId: number, createCommunityDto: CreateCommunityDto): Promise<Community> {
    try {
      const user = await this.userRepository.findUserById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const post = this.postRepository.create({
        ...createCommunityDto,
        user, // user 객체를 설정
      });

      return await this.postRepository.save(post);
    } catch (error) {
      this.handleError(error);
    }
  }

  // 게시글 조회
  async getPostById(id: number): Promise<Community> {
    const post = await this.postRepository.findPostById(id);
    if (!post) {
      throw new NotFoundException(CommunityService.POST_NOT_FOUND_MSG(id));
    }
    return post;
  }

  // 게시글 수정
  async updatePost(userId: number, id: number, updateCommunityDto: UpdateCommunityDto): Promise<Community> {
    try {
      const post = await this.getPostById(id);
      this.checkOwnership(userId, post.user.id); // 권한 확인
      await this.postRepository.updatePost(id, updateCommunityDto);
      return this.getPostById(id);
    } catch (error) {
      this.handleError(error);
    }
  }

  // 게시글 삭제
  async deletePost(userId: number, id: number): Promise<void> {
    try {
      const post = await this.getPostById(id);
      this.checkOwnership(userId, post.user.id); // 권한 확인
      await this.postRepository.deletePost(id);
    } catch (error) {
      this.handleError(error);
    }
  }

  // 댓글 목록 조회 (페이징 처리)
  async getComments(postId: number, paginationQuery: PaginationQueryDto): Promise<Comment[]> {
    return this.commentRepository.getCommentsWithCounts(postId, paginationQuery);
  }

  // 특정 댓글에 대한 대댓글 목록 조회
  async getReplies(commentId: number): Promise<Comment[]> {
    const comment = await this.commentRepository.findWithRepliesAndCounts(commentId);
    if (!comment) {
      throw new NotFoundException(CommunityService.COMMENT_NOT_FOUND_MSG(commentId));
    }
    return comment.replies;
  }

  // 댓글 생성
  async createComment(userId: number, postId: number, createCommentDto: CreateCommentDto): Promise<Comment> {
    try {
      return await this.dataSource.transaction(async (manager: EntityManager) => {
        const user = await manager.findOne(User, { where: { id: userId } });
        if (!user) {
          throw new NotFoundException('User not found');
        }

        const comment = await this.commentRepository.addComment(postId, createCommentDto, manager);
        await this.updatePostCommentCount(postId, manager);
        return comment;
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  // 댓글 수정
  async updateComment(userId: number, postId: number, commentId: number, updateCommentDto: UpdateCommentDto): Promise<Comment> {
    try {
      return await this.dataSource.transaction(async (manager: EntityManager) => {
        const comment = await manager.findOneOrFail(Comment, {
          where: { id: commentId, postId },
          relations: ['user'],
        });

        this.checkOwnership(userId, comment.user.id); // 권한 확인

        await manager.update(Comment, commentId, updateCommentDto);
        return manager.findOneOrFail(Comment, { where: { id: commentId } });
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  // 댓글 삭제
  async deleteComment(userId: number, postId: number, commentId: number): Promise<void> {
    try {
      return await this.dataSource.transaction(async (manager: EntityManager) => {
        const comment = await manager.findOneOrFail(Comment, {
          where: { id: commentId, postId },
          relations: ['user'],
        });

        this.checkOwnership(userId, comment.user.id); // 권한 확인

        await this.commentRepository.deleteCommentAndReplies(commentId, manager);
        await this.updatePostCommentCount(postId, manager);
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  // 대댓글 생성
  async createReply(userId: number, postId: number, parentId: number, createCommentDto: CreateCommentDto): Promise<Comment> {
    try {
      return await this.dataSource.transaction(async (manager: EntityManager) => {
        const user = await manager.findOne(User, { where: { id: userId } });
        if (!user) {
          throw new NotFoundException('User not found');
        }

        const reply = await this.commentRepository.addReply(parentId, createCommentDto, manager);
        await this.updateReplyCount(parentId, manager);
        return reply;
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  // 대댓글 수정
  async updateReply(userId: number, postId: number, commentId: number, updateCommentDto: UpdateCommentDto): Promise<Comment> {
    try {
      return await this.dataSource.transaction(async (manager: EntityManager) => {
        const reply = await manager.findOneOrFail(Comment, {
          where: { id: commentId, postId, parentId: commentId },
        });

        this.checkOwnership(userId, reply.user.id); // 권한 확인

        await manager.update(Comment, commentId, updateCommentDto);
        return manager.findOneOrFail(Comment, { where: { id: commentId } });
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  // 대댓글 삭제
  async deleteReply(userId: number, postId: number, commentId: number): Promise<void> {
    try {
      return await this.dataSource.transaction(async (manager: EntityManager) => {
        const reply = await manager.findOneOrFail(Comment, {
          where: { id: commentId, postId },
          relations: ['parent'],
        });

        this.checkOwnership(userId, reply.user.id); // 권한 확인

        await this.commentRepository.deleteCommentAndReplies(commentId, manager);
        if (reply.parentId) {
          await this.updateReplyCount(reply.parentId, manager);
        }
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  // 게시글의 댓글 수 업데이트
  private async updatePostCommentCount(postId: number, manager: EntityManager): Promise<void> {
    const count = await manager.count(Comment, { where: { postId, parentId: null } });
    await manager.update(Community, { postId }, { commentCount: count });
  }

  // 대댓글 수 업데이트
  private async updateReplyCount(commentId: number, manager: EntityManager): Promise<void> {
    const count = await manager.count(Comment, { where: { parentId: commentId } });
    await manager.update(Comment, { id: commentId }, { replyCount: count });
  }

  // 게시글의 좋아요 수 증가
  async incrementLike(postId: number): Promise<void> {
    try {
      await this.postRepository.incrementLikeCount(postId);
    } catch (error) {
      this.handleError(error);
    }
  }

  // 게시글의 좋아요 수 감소
  async decrementLike(postId: number): Promise<void> {
    try {
      await this.postRepository.decrementLikeCount(postId);
    } catch (error) {
      this.handleError(error);
    }
  }

  // 게시글의 조회 수 증가
  async incrementView(postId: number): Promise<void> {
    try {
      await this.postRepository.incrementViewCount(postId);
    } catch (error) {
      this.handleError(error);
    }
  }

  // 오류 처리 메소드
  private handleError(error: any): void {
    if (error instanceof HttpException) {
      throw error;
    }
    throw new HttpException('서버 오류 발생', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
