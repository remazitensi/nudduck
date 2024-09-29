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
import { CommentsDto } from '../../types/commets-type';

export const Comment: React.FC<{ comment: CommentsDto }> = ({ comment }) => {
  const createdAt = changeDateWithFormat(comment.createdAt);
  // console.log(comment.createdAt, '--->', createdAt);

  return (
    <div>
      <div className='flex gap-[10px] pl-[20px] pt-[20px]'>
        <div className='h-[50px] w-[50px] rounded-full'>
          <img className='object-cover' src={comment.imageUrl} alt='profile-img' />
        </div>
        <div className='flex items-center text-[20px] font-semibold'>{comment.nickname}</div>
        <div className='flex items-center text-[12px] text-[#AEAC9A]'>{createdAt}</div>
      </div>
      <div className='pl-[20px] pt-[7px] text-[16px]'>{comment.content}</div>
    </div>
  );
};
