import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError } from 'typeorm';
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
  ) {}

  // 게시글 생성
  async createPost(createCommunityDto: CreateCommunityDto): Promise<Community> {
    const post = this.postRepository.create(createCommunityDto);
    return this.postRepository.save(post);
  }

  // 게시글 ID로 조회
  async getPostById(id: number): Promise<Community> {
    const post = await this.postRepository.findOneBy({ postId: id }); // findOneBy로 수정
    if (!post) {
      throw new NotFoundException(`ID가 ${id}인 게시글을 찾을 수 없습니다.`);
    }
    return post;
  }

  // 게시글 업데이트
  async updatePost(id: number, updateCommunityDto: UpdateCommunityDto): Promise<Community> {
    await this.postRepository.update(id, updateCommunityDto);
    return this.getPostById(id);
  }

  // 게시글 삭제
  async deletePost(id: number): Promise<void> {
    const result = await this.postRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`ID가 ${id}인 게시글을 찾을 수 없습니다.`);
    }
  }

  // 모든 게시글 조회 (페이징 처리)
  async getAllPosts(paginationQuery: PaginationQueryDto): Promise<Community[]> {
    const { page = 1, pageSize = 10 } = paginationQuery;
    const take = pageSize;
    const skip = (page - 1) * pageSize;
    return this.postRepository.find({ take, skip });
  }

  // 카테고리로 게시글 조회 (페이징 처리)
  async getPostsByCategory(category: Category, paginationQuery: PaginationQueryDto): Promise<Community[]> {
    const { page = 1, pageSize = 10 } = paginationQuery;
    const take = pageSize;
    const skip = (page - 1) * pageSize;
    return this.postRepository.findByCategory(category, take, skip);
  }

  // 댓글 생성
  async createComment(postId: number, createCommentDto: CreateCommentDto): Promise<Comment> {
    const comment = this.commentRepository.create({
      ...createCommentDto,
      postId,
    });
    const savedComment = await this.commentRepository.save(comment);
    // 게시글 댓글 수 업데이트
    await this.updatePostCommentCount(postId);
    return savedComment;
  }

  // 댓글 업데이트
  async updateComment(postId: number, commentId: number, updateCommentDto: UpdateCommentDto): Promise<Comment> {
    await this.commentRepository.update(commentId, updateCommentDto);
    return this.commentRepository.findWithReplies(commentId);
  }

  // 댓글 삭제
  async deleteComment(postId: number, commentId: number): Promise<void> {
    await this.commentRepository.deleteCommentAndReplies(commentId);
    // 게시글 댓글 수 업데이트
    await this.updatePostCommentCount(postId);
  }

  // 대댓글 생성
  async createReply(postId: number, parentId: number, createCommentDto: CreateCommentDto): Promise<Comment> {
    return this.commentRepository.createReply(createCommentDto.content, createCommentDto.userId, postId, parentId);
  }

  // 대댓글 업데이트
  async updateReply(postId: number, commentId: number, updateCommentDto: UpdateCommentDto): Promise<Comment> {
    return this.updateComment(postId, commentId, updateCommentDto);
  }

  // 대댓글 삭제
  async deleteReply(postId: number, commentId: number): Promise<void> {
    await this.commentRepository.deleteCommentAndReplies(commentId);
  }

  // 댓글의 대댓글 조회
  async getReplies(postId: number, commentId: number): Promise<Comment[]> {
    try {
      const comment = await this.commentRepository.findWithReplies(commentId);
      if (!comment) {
        throw new NotFoundException(`ID가 ${commentId}인 댓글을 찾을 수 없습니다.`);
      }
      return comment.replies;
    } catch (error) {
      if (error instanceof QueryFailedError) {
        // 구체적인 쿼리 실패 오류 처리
        throw new HttpException(`쿼리 실행 오류: ${error.message}`, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('댓글의 대댓글 조회 중 서버 오류가 발생했습니다.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // 게시글 댓글 수 업데이트
  private async updatePostCommentCount(postId: number): Promise<void> {
    try {
      const commentCount = await this.commentRepository.countByPostId(postId);
      await this.postRepository.update(postId, { commentCount });
    } catch (error) {
      if (error instanceof QueryFailedError) {
        // 구체적인 쿼리 실패 오류 처리
        throw new HttpException(`쿼리 실행 오류: ${error.message}`, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('게시글 댓글 수 업데이트 중 서버 오류가 발생했습니다.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
