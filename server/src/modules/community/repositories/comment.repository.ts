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

import { Repository, EntityManager, QueryFailedError } from 'typeorm';
import { Comment } from '@_modules/community/entities/comment.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Community } from '@_modules/community/entities/community.entity';
import { CreateCommentDto } from '@_modules/community/dto/request/create-comment.dto';
import { UpdateCommentDto } from '@_modules/community/dto/request/update-comment.dto';
import { User } from '@_modules/user/entity/user.entity';

export class CommentRepository extends Repository<Comment> {
  private handleError(error: unknown): void {
    if (error instanceof QueryFailedError) {
      throw new HttpException('쿼리 오류 발생', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    throw new HttpException('서버 오류 발생', HttpStatus.INTERNAL_SERVER_ERROR);
  }

  async findCommentsWithReplyCount(postId: number, limit: number, offset: number): Promise<Comment[]> {
    try {
      return await this.createQueryBuilder('comment')
        .leftJoinAndSelect('comment.user', 'user')
        .where('comment.postId = :postId', { postId })
        .andWhere('comment.parentId IS NULL')
        .orderBy('comment.createdAt', 'DESC')
        .skip(offset)
        .take(limit)
        .select(['comment.id', 'comment.content', 'comment.createdAt', 'comment.updatedAt', 'comment.parentId', 'user.nickname', 'user.image_url', 'user.id'])
        .getMany();
    } catch (error) {
      this.handleError(error);
    }
  }

  async createComment(postId: number, createCommentDto: CreateCommentDto, userId: number, manager: EntityManager): Promise<Comment> {
    const comment = new Comment();
    comment.content = createCommentDto.content;
    comment.postId = postId;
    comment.parentId = createCommentDto.parentId;
    comment.community = { postId } as Community;

    const user = new User();
    user.id = userId;
    comment.user = user;

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
      return comment;
    } catch (error) {
      this.handleError(error);
    }
  }

  async findCommentById(commentId: number): Promise<Comment | undefined> {
    try {
      return await this.createQueryBuilder('comment')
        .leftJoinAndSelect('comment.user', 'user')
        .where('comment.id = :commentId', { commentId })
        .select(['comment.id', 'comment.content', 'comment.createdAt', 'comment.updatedAt', 'comment.parentId', 'user.nickname', 'user.image_url', 'user.id'])
        .getOne();
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateComment(commentId: number, updateCommentDto: UpdateCommentDto): Promise<Comment | undefined> {
    try {
      const comment = await this.findOne({ where: { id: commentId }, relations: ['user'] });

      if (!comment) {
        throw new HttpException('댓글을 찾을 수 없습니다.', HttpStatus.NOT_FOUND);
      }

      comment.content = updateCommentDto.content || comment.content;
      await this.save(comment);

      return comment;
    } catch (error) {
      this.handleError(error);
    }
  }

  async createReply(commentId: number, createCommentDto: CreateCommentDto, userId: number, manager: EntityManager): Promise<Comment> {
    const reply = new Comment();
    reply.content = createCommentDto.content;
    reply.postId = createCommentDto.postId;
    reply.parentId = commentId;

    const user = new User();
    user.id = userId;
    reply.user = user;

    reply.community = { postId: createCommentDto.postId } as Community;

    try {
      await manager.transaction(async (transactionalEntityManager: EntityManager) => {
        await transactionalEntityManager.save(Comment, reply);
      });
      return reply;
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateReply(replyId: number, updateCommentDto: UpdateCommentDto): Promise<Comment | undefined> {
    try {
      const reply = await this.findOne({ where: { id: replyId }, relations: ['user'] });

      if (!reply) {
        throw new HttpException('대댓글을 찾을 수 없습니다.', HttpStatus.NOT_FOUND);
      }

      reply.content = updateCommentDto.content || reply.content;
      await this.save(reply);

      return reply;
    } catch (error) {
      this.handleError(error);
    }
  }

  async deleteReply(replyId: number): Promise<void> {
    try {
      const reply = await this.findOne({ where: { id: replyId } });

      if (!reply) {
        throw new HttpException('대댓글을 찾을 수 없습니다.', HttpStatus.NOT_FOUND);
      }

      await this.remove(reply);
    } catch (error) {
      this.handleError(error);
    }
  }

  async deleteComment(commentId: number): Promise<void> {
    try {
      const comment = await this.findOne({ where: { id: commentId } });

      if (!comment) {
        throw new HttpException('댓글을 찾을 수 없습니다.', HttpStatus.NOT_FOUND);
      }

      await this.remove(comment);

      await this.createQueryBuilder()
        .update(Community)
        .set({ commentCount: () => 'commentCount - 1' })
        .where('postId = :postId', { postId: comment.postId })
        .execute();
    } catch (error) {
      this.handleError(error);
    }
  }

  async findRepliesByCommentId(commentId: number, limit: number, offset: number): Promise<Comment[]> {
    try {
      return await this.createQueryBuilder('comment')
        .leftJoinAndSelect('comment.user', 'user')
        .where('comment.parentId = :commentId', { commentId })
        .orderBy('comment.createdAt', 'DESC')
        .skip(offset)
        .take(limit)
        .select(['comment.id', 'comment.content', 'comment.createdAt', 'comment.updatedAt', 'comment.parentId', 'user.nickname', 'user.image_url', 'user.id'])
        .getMany();
    } catch (error) {
      this.handleError(error);
    }
  }
}
