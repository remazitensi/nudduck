/**
 * File Name    : Reply.tsx
 * Description  : 대댓글 컴포넌트
 * Author       : 김민지
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.28    김민지      Created
 * 2024.09.30    김민지      Modified    대댓글 데이터 매핑
 */

import { CommentsDto } from '../../types/comments-type';

export const Reply = (props: { replies: CommentsDto[] }) => {
  const { replies } = props;

  console.log(replies);

  return (
    <div className='Reply mt-[20px] flex flex-col'>
      {replies.map((reply, index) => (
        <div key={index} className='reply-item'>
          <div className='flex items-center gap-[10px] pl-[20px] pt-[20px]'>
            {/* 대댓글 화살표 */}
            <img className='h-[32px] w-[32px]' src='/comment-arrow.png' alt='replyImg' />
            <img className='' src={reply.imageUrl} alt='userImg' />
            <div className='flex items-center text-[20px] font-semibold'>{reply.nickname}</div>
            <div className='flex items-center text-[12px] text-[#AEAC9A]'>{reply.createdAt}</div>
            <div className='flex items-center gap-[10px] px-[10px]'>
              <div className='flex items-center p-[5px] text-[12px] text-[#AEAC9A]'>수정</div>
              <div className='flex items-center p-[5px] text-[12px] text-[#AEAC9A]'>삭제</div>
            </div>
          </div>
          <div className='pl-[60px] pt-[7px] text-[16px]'>{reply.content}</div>
          <div className='mt-[35px] w-[1200px] border-b-2 border-[8D8B67]'></div>
        </div>
      ))}
    </div>
  );
};
