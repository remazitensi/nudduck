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
 */

import { Repository, EntityManager, QueryFailedError } from 'typeorm';
import { Comment } from '../entities/comment.entity';
import { Community } from '../entities/community.entity';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { PaginationQueryDto } from '../dto/pagination-query.dto';
import { User } from '@_modules/user/entity/user.entity';
import { HttpException, HttpStatus } from '@nestjs/common';

export class CommentRepository extends Repository<Comment> {
  // 오류 처리 메소드
  private handleError(error: any): void {
    if (error instanceof QueryFailedError) {
      throw new HttpException('쿼리 오류 발생', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    throw new HttpException('서버 오류 발생', HttpStatus.INTERNAL_SERVER_ERROR);
  }

  // 대댓글을 포함한 댓글 조회 메소드
  async findWithRepliesAndCounts(commentId: number): Promise<Comment | undefined> {
    try {
      return await this.createQueryBuilder('comment')
        .leftJoinAndSelect('comment.replies', 'replies')
        .leftJoin(
          (subQuery) => {
            return subQuery.select('parent.id', 'id').addSelect('COUNT(child.id)', 'replyCount').from(Comment, 'parent').leftJoin(Comment, 'child', 'child.parentId = parent.id').groupBy('parent.id');
          },
          'replyCountQuery',
          'replyCountQuery.id = comment.id',
        )
        .addSelect('COALESCE(replyCountQuery.replyCount, 0)', 'replyCount')
        .where('comment.id = :commentId', { commentId })
        .getOne();
    } catch (error) {
      this.handleError(error);
    }
  }

  // 댓글 목록 조회 (페이지네이션)
  async getCommentsWithCounts(postId: number, paginationQuery: PaginationQueryDto): Promise<Comment[]> {
    const { page = 1, pageSize = 10 } = paginationQuery;
    const take = pageSize;
    const skip = (page - 1) * pageSize;

    try {
      return await this.createQueryBuilder('comment')
        .leftJoinAndSelect('comment.user', 'user')
        .leftJoin(
          (subQuery) => {
            return subQuery.select('parent.id', 'id').addSelect('COUNT(child.id)', 'replyCount').from(Comment, 'parent').leftJoin(Comment, 'child', 'child.parentId = parent.id').groupBy('parent.id');
          },
          'replyCountQuery',
          'replyCountQuery.id = comment.id',
        )
        .addSelect('COALESCE(replyCountQuery.replyCount, 0)', 'replyCount')
        .where('comment.postId = :postId', { postId })
        .andWhere('comment.parentId IS NULL') // 부모 댓글만 조회
        .take(take)
        .skip(skip)
        .getMany();
    } catch (error) {
      this.handleError(error);
    }
  }

  // 커뮤니티 게시글에 댓글 추가
  async addComment(postId: number, createCommentDto: CreateCommentDto, manager: EntityManager): Promise<Comment> {
    const comment = new Comment();
    comment.content = createCommentDto.content;
    comment.postId = postId;
    comment.user = { id: createCommentDto.userId } as User;
    comment.community = { postId } as Community;

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

    return comment;
  }

  // 대댓글 추가
  async addReply(commentId: number, createCommentDto: CreateCommentDto, manager: EntityManager): Promise<Comment> {
    const reply = new Comment();
    reply.content = createCommentDto.content;
    reply.parentId = commentId;
    reply.user = { id: createCommentDto.userId } as User;
    reply.community = { postId: (await this.findCommentById(commentId)).postId } as Community;

    try {
      await manager.transaction(async (transactionalEntityManager: EntityManager) => {
        await transactionalEntityManager.save(Comment, reply);

        const count = await transactionalEntityManager
          .createQueryBuilder()
          .select('COUNT(*)', 'count')
          .from(Comment, 'comment')
          .where('comment.parentId = :parentId', { parentId: commentId })
          .getRawOne();

        await transactionalEntityManager.createQueryBuilder().update(Comment).set({ replyCount: count.count }).where('id = :commentId', { commentId }).execute();
      });
    } catch (error) {
      this.handleError(error);
    }

    return reply;
  }

  // 댓글 조회 (단일 댓글 조회)
  async findCommentById(commentId: number): Promise<Comment | undefined> {
    try {
      return await this.findOne({ where: { id: commentId } });
    } catch (error) {
      this.handleError(error);
    }
  }

  // 댓글과 대댓글 삭제
  async deleteCommentAndReplies(commentId: number, manager: EntityManager): Promise<void> {
    try {
      await manager.transaction(async (transactionalEntityManager: EntityManager) => {
        // 대댓글 삭제
        await transactionalEntityManager.createQueryBuilder().delete().from(Comment).where('parentId = :parentId', { parentId: commentId }).execute();

        // 댓글 삭제
        await transactionalEntityManager.createQueryBuilder().delete().from(Comment).where('id = :id', { id: commentId }).execute();
      });
    } catch (error) {
      this.handleError(error);
    }
  }
}
