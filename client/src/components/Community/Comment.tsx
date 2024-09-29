/**
 * File Name    : Comment.tsx
 * Description  : 부모 댓글 컴포넌트
 * Author       : 김민지
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.28    김민지      Created
 */

import { changeDateWithFormat } from '../../apis/change-date-format';
import { CommentsDto } from '../../types/comments-type';

export const Comment: React.FC<{ comment: CommentsDto; isWriter: boolean }> = ({ comment, isWriter }) => {
  const createdAt = changeDateWithFormat(comment.createdAt);

  return (
    <div>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-[10px] p-[10px]'>
          <div className='h-[50px] w-[50px] rounded-full'>
            <img className='object-cover' src={comment.imageUrl} alt='profile-img' />
          </div>
          <div className='flex items-center text-[20px] font-semibold'>{comment.nickname}</div>
          <div className='flex items-center text-[12px] text-[#AEAC9A]'>{createdAt}</div>
          <div className='flex items-center p-[5px] text-[16px] font-semibold text-[#AEAC9A] hover:text-[#909700]'>대댓글 달기</div>
        </div>
        {isWriter && (
          <div className='flex items-center gap-[10px] px-[10px]'>
            <div className='flex items-center p-[5px] text-[12px] text-[#AEAC9A]'>수정</div>
            <div className='flex items-center p-[5px] text-[12px] text-[#AEAC9A]'>삭제</div>
          </div>
        )}
      </div>
      <div className='pl-[68px] text-[16px]'>{comment.content}</div>
    </div>
  );
};
