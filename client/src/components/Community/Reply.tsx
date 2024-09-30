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
import { changeDateWithFormat } from '../../utils/change-date-with-format';

export const Reply = (props: { replies: CommentsDto[]; userId: number; onDelete: (postId: number, commentId: number) => void }) => {
  const { replies, userId, onDelete } = props;

  // const handleDeleteComment = async (postId: number, commentId: number) => {
  //   const response = await deleteReply(postId, commentId);
  //   if (response.status === 204) {
  //     // onDelete(); // 상위 컴포넌트에 삭제를 알림
  //   }
  // };
  // console.log(replies);

  return (
    <div className='Reply mt-[20px] flex flex-col'>
      {replies.map((reply, index) => (
        <div key={index} className='reply-item'>
          <div className='flex items-center gap-[10px] pl-[20px] pt-[20px]'>
            {/* 대댓글 화살표 */}
            <img className='h-[32px] w-[32px]' src='/comment-arrow.png' alt='replyImg' />
            <div className='h-[50px] w-[50px] rounded-full'>
              <img className='rounded-full object-cover' src={reply.imageUrl} alt='profile-img' />
            </div>

            <div className='flex items-center text-[20px] font-semibold'>{reply.nickname}</div>

            <div className='flex items-center justify-between'>
              <div className='flex items-center text-[12px] text-[#AEAC9A]'>{changeDateWithFormat(reply.createdAt)}</div>
            </div>
            {userId === reply.userId && (
              <div className='ml-auto flex items-center gap-[10px] px-[10px]'>
                {/* <div className='flex cursor-pointer items-center p-[5px] text-[15px] font-semibold text-[#AEAC9A] hover:text-[#909700]'>수정</div> */}
                <div
                  className='flex cursor-pointer items-center p-[5px] text-[15px] font-semibold text-[#AEAC9A] hover:text-[#909700]'
                  onClick={() => onDelete(reply.postId, reply.commentId)} // 여기서 콜백 호출
                >
                  삭제
                </div>
              </div>
            )}
          </div>

          <div className='pl-[60px] pt-[7px] text-[16px]'>{reply.content}</div>
          <div className='mt-[35px] w-[1200px] border-b-2 border-[8D8B67]'></div>
        </div>
      ))}
    </div>
  );
};
