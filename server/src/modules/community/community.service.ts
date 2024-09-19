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
 */

import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryFailedError } from 'typeorm';
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

    private readonly dataSource: DataSource, // 트랜잭션 사용을 위한 데이터 소스
  ) {}

  // 게시글 생성
  async createPost(createCommunityDto: CreateCommunityDto): Promise<Community> {
    const post = this.postRepository.create(createCommunityDto);
    return this.postRepository.save(post);
  }

  // 게시글 ID로 조회
  async getPostById(id: number): Promise<Community> {
    const post = await this.postRepository.findOneBy({ postId: id });
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
    try {
      return await this.dataSource.transaction(async (manager) => {
        const comment = this.commentRepository.create({
          ...createCommentDto,
          postId,
        });
        const savedComment = await manager.save(Comment, comment);
        // 게시글 댓글 수 업데이트
        await this.updatePostCommentCount(postId, manager);
        return savedComment;
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  // 댓글 업데이트
  async updateComment(postId: number, commentId: number, updateCommentDto: UpdateCommentDto): Promise<Comment> {
    return await this.dataSource.transaction(async (manager) => {
      try {
        await manager.update(Comment, commentId, updateCommentDto);
        return await this.commentRepository.findWithReplies(commentId);
      } catch (error) {
        this.handleError(error);
      }
    });
  }

  // 댓글 삭제
  async deleteComment(postId: number, commentId: number): Promise<void> {
    try {
      await this.dataSource.transaction(async (manager) => {
        const result = await manager.delete(Comment, { id: commentId }); // 수정: { id: commentId }로 삭제 조건
        if (result.affected === 0) {
          throw new NotFoundException(`ID가 ${commentId}인 댓글을 찾을 수 없습니다.`);
        }
        // 게시글 댓글 수 업데이트
        await this.updatePostCommentCount(postId, manager);
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  // 대댓글 생성
  async createReply(postId: number, parentId: number, createCommentDto: CreateCommentDto): Promise<Comment> {
    return await this.dataSource.transaction(async (manager) => {
      try {
        const reply = await this.commentRepository.createReply(createCommentDto.content, createCommentDto.userId, postId, parentId);
        await manager.save(reply);
        return reply;
      } catch (error) {
        this.handleError(error);
      }
    });
  }

  // 대댓글 업데이트
  async updateReply(postId: number, commentId: number, updateCommentDto: UpdateCommentDto): Promise<Comment> {
    return this.updateComment(postId, commentId, updateCommentDto);
  }

  // 대댓글 삭제
  async deleteReply(postId: number, commentId: number): Promise<void> {
    return await this.deleteComment(postId, commentId);
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
      this.handleError(error);
    }
  }

  // 게시글 댓글 수 업데이트 (트랜잭션 사용)
  private async updatePostCommentCount(postId: number, manager: any): Promise<void> {
    try {
      const commentCount = await manager.count(Comment, { where: { postId } });
      await manager.update(Community, postId, { commentCount });
    } catch (error) {
      this.handleError(error);
    }
  }

  // 게시글 좋아요 수 증가
  async incrementLikes(postId: number): Promise<void> {
    try {
      await this.dataSource.transaction(async (manager) => {
        const post = await manager.findOne(Community, { where: { postId } });

        if (!post) {
          throw new NotFoundException(`ID가 ${postId}인 게시글을 찾을 수 없습니다.`);
        }

        post.likeCount += 1;
        await manager.save(post);
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  // 게시글 좋아요 수 감소
  async decrementLikes(postId: number): Promise<void> {
    try {
      await this.dataSource.transaction(async (manager) => {
        const post = await manager.findOne(Community, { where: { postId } });

        if (!post) {
          throw new NotFoundException(`ID가 ${postId}인 게시글을 찾을 수 없습니다.`);
        }

        if (post.likeCount > 0) {
          post.likeCount -= 1;
          await manager.save(post);
        } else {
          throw new HttpException('좋아요 수는 0보다 작을 수 없습니다.', HttpStatus.BAD_REQUEST);
        }
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  // 게시글 조회수 증가
  async incrementViews(postId: number): Promise<void> {
    try {
      await this.dataSource.transaction(async (manager) => {
        const post = await manager.findOne(Community, { where: { postId } });

        if (!post) {
          throw new NotFoundException(`ID가 ${postId}인 게시글을 찾을 수 없습니다.`);
        }

        post.viewCount += 1;
        await manager.save(post);
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  // 에러 처리 메소드
  private handleError(error: any): void {
    if (error instanceof QueryFailedError) {
      throw new HttpException(`쿼리 실행 오류: ${error.message}`, HttpStatus.BAD_REQUEST);
    } else if (error instanceof NotFoundException) {
      throw error; // NotFoundException을 그대로 던집니다.
    } else {
      throw new HttpException('서버 오류가 발생했습니다.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
