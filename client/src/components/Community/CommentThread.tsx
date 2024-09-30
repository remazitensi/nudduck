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
import { getReply } from '../../apis/community/community-comments-api';
import { CommentsDto } from '../../types/comments-type';
import { Comment } from './Comment';
import { Reply } from './Reply';

export const CommentThread: React.FC<{ comment: CommentsDto; userId: number }> = ({ comment, userId }) => {
  // Reply 컴포넌트의 표시 여부를 관리하는 상태
  const [isReplyVisible, setIsReplyVisible] = useState(false);
  const [replies, setReplies] = useState<CommentsDto[]>([]);

  // isWriter 계산을 한 번만 수행
  const isWriter = comment.userId === userId;

  // Reply 컴포넌트 표시/숨기기 토글 함수
  const toggleReplyVisibility = async () => {
    if (!isReplyVisible && comment.replyCount > 0) {
      // 대댓글이 처음 열릴 때만 API 요청을 보냄
      const replyData = await fetchReplyComment();
      setReplies(replyData);
    }
    setIsReplyVisible(!isReplyVisible);
  };

  // 대댓글 조회 API 요청 함수
  const fetchReplyComment = async () => {
    const data = await getReply(comment.postId, comment.commentId);
    return data;
  };

  return (
    <div>
      <div className='mt-[35px] w-[1200px] border-b-2 border-[8D8B67]'></div>
      {/* isWriter 값을 바로 전달 */}
      <Comment comment={comment} isWriter={isWriter} />

      {/* 대댓글이 있을 경우에만 토글 표시 */}
      {comment.replyCount > 0 && (
        <div className='flex items-center gap-[10px]'>
          {!isReplyVisible && (
            <div className='flex items-center gap-[10px]' onClick={toggleReplyVisibility}>
              <img src='/down_arrow.png' alt='댓글 열기' />
              <p>댓글 열기 ({comment.replyCount})</p>
            </div>
          )}
          {isReplyVisible && (
            <div className='flex items-center gap-[10px]' onClick={toggleReplyVisibility}>
              <img src='/up_arrow.png' alt='댓글 닫기' />
              <p>댓글 닫기</p>
            </div>
          )}
        </div>
      )}

      {/* isReplyVisible이 true일 때만 Reply 컴포넌트 표시 */}
      {isReplyVisible && <Reply replies={replies} />}
    </div>
  );
};
