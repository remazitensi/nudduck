/**
 * File Name    : Comment.tsx
 * Description  : 부모 댓글 컴포넌트
 * Author       : 김민지
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.28    김민지      Created
 */

import { deleteComment } from '../../apis/community/community-comments-api';
import { CommentsDto } from '../../types/comments-type';
import { changeDateWithFormat } from '../../utils/change-date-with-format';

export const Comment: React.FC<{ comment: CommentsDto; isWriter: boolean; onDelete: () => void; onReply: () => void }> = ({ comment, isWriter, onDelete, onReply }) => {
  const createdAt = changeDateWithFormat(comment.createdAt);

  const handleDeleteComment = async () => {
    const response = await deleteComment(comment.postId, comment.commentId);
    if (response.status === 204) {
      onDelete(); // 상위 컴포넌트에 삭제를 알림
    }
  };

  return (
    <div>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-[10px] p-[10px]'>
          <div className='h-[50px] w-[50px] rounded-full'>
            <img className='object-cover' src={comment.imageUrl} alt='profile-img' />
          </div>
          <div className='flex items-center text-[20px] font-semibold'>{comment.nickname}</div>
          <div className='flex items-center text-[12px] text-[#AEAC9A]'>{createdAt}</div>
          <div className='flex cursor-pointer items-center p-[5px] text-[16px] font-semibold text-[#AEAC9A] hover:text-[#909700]' onClick={onReply}>
            대댓글 달기
          </div>
        </div>
        {isWriter && (
          <div className='flex items-center gap-[10px] px-[10px]'>
            <div className='flex cursor-pointer items-center p-[5px] text-[15px] font-semibold text-[#AEAC9A] hover:text-[#909700]'>수정</div>
            <div className='flex cursor-pointer items-center p-[5px] text-[15px] font-semibold text-[#AEAC9A] hover:text-[#909700]' onClick={handleDeleteComment}>
              삭제
            </div>
          </div>
        )}
      </div>
      <div className='pl-[70px] text-[20px]'>{comment.content}</div>
    </div>
  );
};
