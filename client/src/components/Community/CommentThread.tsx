/**
 * File Name    : CommentThread.tsx
 * Description  : 부모 댓글을 기준으로 댓글과 대댓글을 묶은 컴포넌트
 * Author       : 김민지
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.28    김민지      Created
 */

import { useState } from 'react';
import { CommentsDto } from '../../types/commets-type';
import { Comment } from './Comment';
import { Reply } from './Reply';

export const CommentThread: React.FC<{ comment: CommentsDto }> = ({ comment }) => {
  // Reply 컴포넌트의 표시 여부를 관리하는 상태
  const [isReplyVisible, setIsReplyVisible] = useState(false);

  // Reply 컴포넌트 표시/숨기기 토글 함수
  const toggleReplyVisibility = () => {
    setIsReplyVisible(!isReplyVisible);
  };

  return (
    <div>
      <Comment comment={comment} />

      <div className='flex items-center gap-[10px]'>
        {/* 댓글이 닫힌 상태일 때 down arrow와 댓글 열기 표시 */}
        {comment.replyCount !== 0 && !isReplyVisible && (
          <div className='flex items-center gap-[10px]' onClick={toggleReplyVisibility}>
            <img src='/down_arrow.png' alt='댓글 열기' />
            <p>댓글 열기 (${comment.replyCount})</p>
          </div>
        )}

        {/* 댓글이 열린 상태일 때 up arrow와 댓글 닫기 표시 */}
        {isReplyVisible && (
          <div className='flex items-center gap-[10px]' onClick={toggleReplyVisibility}>
            <img src='/up_arrow.png' alt='댓글 닫기' />
            <p>댓글 닫기</p>
          </div>
        )}
      </div>

      {/* isReplyVisible이 true일 때만 Reply 컴포넌트 표시 */}
      {isReplyVisible && <Reply />}
    </div>
  );
};
