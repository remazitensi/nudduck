/**
 * File Name    : CommentSection.tsx
 * Description  : 댓글 목록 컴포넌트
 * Author       : 김민지
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.28    김민지      Created
 */

import { CommentsDto } from '../../types/comments-type';
import { CommentThread } from './CommentThread';

export const CommentSection: React.FC<{ comments: CommentsDto[] }> = ({ comments }) => {
  console.log(comments);
  return (
    <div>
      {/* comments 배열이 null 또는 undefined일 때 빈 배열로 처리 */}
      {comments.length > 0 ? comments.map((comment) => <CommentThread key={comment.commentId} comment={comment} />) : <div>댓글이 없습니다.</div>}
    </div>
  );
};
