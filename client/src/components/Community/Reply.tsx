/**
 * File Name    : Reply.tsx
 * Description  : 대댓글 컴포넌트
 * Author       : 김민지
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.28    김민지      Created
 */

import { CommentsDto } from '../../types/comments-type';

type ReplyProps = {
  replies: CommentsDto[];
};

export const Reply: React.FC<ReplyProps> = ({ replies }) => {
  return (
    <div className='Reply mt-[20px] flex flex-col'>
      <div className='flex items-center gap-[10px] pl-[20px] pt-[20px]'>
        {/* 대댓글 화살표 */}
        <img className='h-[32px] w-[32px]' src='/comment-arrow.png' alt='replyImg' />
        <img className='' src='/cat_image.png' alt='catImg' />
        <div className='flex items-center text-[20px] font-semibold'>스터디구하는자</div>
        <div className='flex items-center text-[12px] text-[#AEAC9A]'>24-09-08 22:22</div>
      </div>
      <div className='pl-[60px] pt-[7px] text-[16px]'>안녕하세요 대댓글 입니다</div>
      <div className='mt-[35px] w-[1200px] border-b-2 border-[8D8B67]'></div>
    </div>
  );
};
