/**
 * File Name    : CommentSection.tsx
 * Description  : 댓글 목록 컴포넌트
 * Author       : 김민지
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.28    김민지      Created
 */

import { CommentThread } from './CommentThread';

export const CommentSection = ({ postId }: { postId: number }) => {
  console.log('Post ID:', postId); // postId는 숫자 값입니다.
  //댓글불러오기

  return (
    <div>
      <CommentThread></CommentThread>
    </div>
  );
};
