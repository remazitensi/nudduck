/**
 * File Name    : comment.entity.ts
 * Description  : 댓글 엔티티
 * Author       : 김재영
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.07    김재영      Created     댓글 엔티티 초기 생성
 */

export class Comment {
  comment_id: number;
  content: string; // 댓글 내용
  parent_id?: number | null; // 상위 댓글의 ID (대댓글일 경우) - 일반 댓글이면 null
  user_id: number; // 댓글 작성자 ID
  post_id: number; // 해당 댓글이 속한 게시글 ID
  created_at: Date;
  updated_at: Date;

  // 대댓글을 위한 댓글 배열
  replies?: Comment[]; // Comment 클래스를 재사용하여 대댓글을 관리
}
