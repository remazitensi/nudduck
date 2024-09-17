/**
 * File Name    : comment.repository.ts
 * Description  : 댓글 리포지토리
 * Author       : 김재영
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.17    김재영      Created     댓글 리포지토리 초기 생성
 * 2024.09.17    김재영      Modified    타입 정의 및 메소드 추가
 */
// comment.repository.ts

import { Repository } from 'typeorm';
import { Comment } from '../entities/comment.entity';

// 커스텀 리포지토리 정의
export class CommentRepository extends Repository<Comment> {
  // 대댓글을 포함한 댓글 조회 메소드
  async findWithReplies(commentId: number): Promise<Comment | undefined> {
    return this.createQueryBuilder('comment').leftJoinAndSelect('comment.replies', 'replies').where('comment.commentId = :commentId', { commentId }).getOne();
  }

  // 댓글의 대댓글 수 업데이트 메소드
  async updateReplyCount(commentId: number, count: number): Promise<void> {
    await this.createQueryBuilder().update(Comment).set({ repleyCount: count }).where('commentId = :commentId', { commentId }).execute();
  }

  // 댓글 삭제 시 대댓글도 삭제하는 메소드
  async deleteCommentAndReplies(commentId: number): Promise<void> {
    await this.createQueryBuilder().delete().from(Comment).where('commentId = :commentId', { commentId }).orWhere('parentId = :commentId', { commentId }).execute();
  }

  // 게시글의 댓글 수를 카운트하는 메소드
  async countByPostId(postId: number): Promise<number> {
    return this.createQueryBuilder('comment').where('comment.postId = :postId', { postId }).getCount();
  }

  // 대댓글 생성 메소드
  async createReply(content: string, userId: number, postId: number, parentId?: number): Promise<Comment> {
    const reply = this.create({
      content,
      userId,
      postId,
      parentId,
    });
    return this.save(reply);
  }
}
