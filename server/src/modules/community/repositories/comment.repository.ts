/**
 * File Name    : comment.repository.ts
 * Description  : 댓글 리포지토리
 * Author       : 김재영
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.17    김재영      Created     댓글 리포지토리 초기 생성
 * 2024.09.17    김재영      Modified    타입 정의 및 메소드 추가
 * 2024.09.19    김재영      Modified    오류 처리 메소드 추가
 * 2024.09.22    김재영      Modified    DTO 및 엔티티에 맞춰 리포지토리 업데이트
 * 2024.09.22    김재영      Modified    대댓글 수정 및 삭제 메소드 추가
 * 2024.09.22    김재영      Modified    replyCount 로직을 조회 시 계산하도록 변경
 * 2024.09.22    김재영      Modified    무한 스크롤 지원
 */

import { CreateCommentDto } from '@_modules/community/dto/request/create-comment.dto';
import { UpdateCommentDto } from '@_modules/community/dto/request/update-comment.dto';
import { Comment } from '@_modules/community/entities/comment.entity';
import { Community } from '@_modules/community/entities/community.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DataSource, EntityManager, QueryFailedError, Repository } from 'typeorm';
import { PaginationQueryDto } from '../dto/request/pagination-query.dto';
import { CommentResponseDto } from '../dto/response/comment-response.dto';

@Injectable()
export class CommentRepository extends Repository<Comment> {
  constructor(dataSource: DataSource) {
    super(Comment, dataSource.createEntityManager());
  }

  // 댓글 작성
  async createComment(postId: number, createCommentDto: CreateCommentDto, userId: number, manager: EntityManager): Promise<void> {
    const comment = this.create({
      content: createCommentDto.content,
      postId,
      parentId: createCommentDto.parentId || null,
      user: { id: userId },
      community: { postId } as Community,
    });

    try {
      await manager.transaction(async (transactionalEntityManager: EntityManager) => {
        await transactionalEntityManager.save(Comment, comment);
        await transactionalEntityManager
          .createQueryBuilder()
          .update(Community)
          .set({ commentCount: () => 'commentCount + 1' })
          .where('postId = :postId', { postId })
          .execute();
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  // 댓글 수정
  async updateComment(commentId: number, updateCommentDto: UpdateCommentDto): Promise<void> {
    try {
      const comment = await this.findOne({ where: { id: commentId } });

      if (!comment) {
        throw new HttpException('댓글을 찾을 수 없습니다.', HttpStatus.NOT_FOUND);
      }

      comment.content = updateCommentDto.content || comment.content;
      await this.save(comment);
    } catch (error) {
      this.handleError(error);
    }
  }

  // 대댓글 작성
  async createReply(commentId: number, createCommentDto: CreateCommentDto, userId: number, manager: EntityManager): Promise<void> {
    await this.createComment(createCommentDto.postId, createCommentDto, userId, manager);
  }

  // 대댓글 수정
  async updateReply(replyId: number, updateCommentDto: UpdateCommentDto): Promise<void> {
    await this.updateComment(replyId, updateCommentDto);
  }

  // 댓글 삭제
  async deleteComment(commentId: number): Promise<void> {
    try {
      const comment = await this.findOne({ where: { id: commentId } });

      if (!comment) {
        throw new HttpException('댓글을 찾을 수 없습니다.', HttpStatus.NOT_FOUND);
      }

      await this.remove(comment);

      // 댓글 수 감소
      await this.createQueryBuilder()
        .update(Community)
        .set({ commentCount: () => 'commentCount - 1' })
        .where('postId = :postId', { postId: comment.postId })
        .execute();
    } catch (error) {
      this.handleError(error);
    }
  }

  // 대댓글 삭제
  async deleteReply(replyId: number): Promise<void> {
    await this.deleteComment(replyId);
  }

  // 댓글 및 대댓글 조회 (페이징 지원)
  async getCommentsWithReplies(postId: number, paginationQuery: PaginationQueryDto): Promise<{ comments: CommentResponseDto[]; total: number }> {
    const { limit, offset, sortField, sortOrder } = this.buildPaginationQuery(paginationQuery);

    try {
      // 부모 댓글만 조회하고, 대댓글 수를 포함한 쿼리
      const [comments, total] = await this.createQueryBuilder('comment')
        .where('comment.postId = :postId', { postId })
        .andWhere('comment.parentId IS NULL') // 부모 댓글만 조회
        .leftJoinAndSelect('comment.user', 'user')
        .addSelect('(SELECT COUNT(*) FROM comment AS child WHERE child.parentId = comment.id) AS replyCount') // 대댓글 수 계산
        .orderBy(`comment.${sortField}`, sortOrder.toUpperCase() as 'ASC' | 'DESC')
        .skip(offset)
        .take(limit)
        .getManyAndCount();

      // CommentResponseDto 생성
      const commentDtos = comments.map((comment) => new CommentResponseDto(comment));

      return { comments: commentDtos, total };
    } catch (error) {
      this.handleError(error);
    }
  }

  private buildPaginationQuery(paginationQuery: PaginationQueryDto) {
    const limit = paginationQuery.limit || 10;
    const offset = paginationQuery.offset || 0;
    const sort = paginationQuery.sort || 'createdAt:desc';

    const [sortField, sortOrder] = sort.split(':');
    const validSortFields = ['createdAt', 'updatedAt'];
    const validSortOrders = ['asc', 'desc'];

    if (!validSortFields.includes(sortField)) {
      throw new HttpException('유효하지 않은 정렬 필드입니다.', HttpStatus.BAD_REQUEST);
    }
    if (!validSortOrders.includes(sortOrder.toLowerCase())) {
      throw new HttpException('유효하지 않은 정렬 순서입니다.', HttpStatus.BAD_REQUEST);
    }

    return { limit, offset, sortField, sortOrder };
  }

  private handleError(error: unknown): void {
    if (error instanceof QueryFailedError) {
      throw new HttpException('쿼리 오류 발생', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    throw new HttpException('서버 오류 발생', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
