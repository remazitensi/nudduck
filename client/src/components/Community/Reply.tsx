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

import { useRef, useState } from 'react';
import { updateReply } from '../../apis/community/community-comments-api';
import { CommentsDto } from '../../types/comments-type';
import { changeDateWithFormat } from '../../utils/change-date-with-format';
import AnotherUserModal from './AnotherUserModal';

export const Reply = (props: { replies: CommentsDto[]; userId: number; onDelete: (postId: number, commentId: number) => void }) => {
  const { replies, userId, onDelete } = props;
  const [openUserModal, setOpenUserModal] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<{ [key: number]: boolean }>({});
  const [editedContent, setEditedContent] = useState<{ [key: number]: string }>({});
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const handleOpenModal = () => {
    setOpenUserModal(true);
  };

  const handleCloseModal = () => {
    setOpenUserModal(false);
  };

  // 대댓글 수정 요청
  const handleUpdateReply = async (reply: CommentsDto) => {
    const data = {
      content: contentRef.current ? contentRef.current.value : '', // textarea의 값 참조
      postId: reply.postId,
      commentId: reply.commentId,
      parentId: reply.parentId,
    };

    if (data.content === '') {
      return alert('대댓글을 입력해주세요!');
    }
    try {
      await updateReply(reply.postId, reply.commentId, data); // 댓글 생성 API 호출
      if (contentRef.current) contentRef.current.value = ''; // 댓글 입력란 초기화
      reply.content = data.content;
      setEditedContent((prevState) => ({
        ...prevState,
        [reply.commentId]: data.content,
      }));
      alert('댓글 수정에 성공했습니다! 😎');
      setIsEditing((prevState) => ({
        ...prevState,
        [reply.commentId]: false, // 수정 모드 종료
      }));
    } catch (error) {
      alert('댓글 수정에 실패했습니다.😢');
    }
  };

  const handleEditClick = (reply: CommentsDto) => {
    // 수정 모드 활성화 및 해당 댓글의 기존 내용을 초기값으로 설정
    setIsEditing((prevState) => ({
      ...prevState,
      [reply.commentId]: true,
    }));
    setEditedContent((prevState) => ({
      ...prevState,
      [reply.commentId]: reply.content, // 해당 댓글의 기존 내용을 초기값으로 설정
    }));
  };

  return (
    <div className='Reply flex flex-col'>
      {replies.map((reply, index) => (
        <div key={index} className='reply-item'>
          {openUserModal && <AnotherUserModal onClose={handleCloseModal} userId={reply.userId} />}
          <div className='flex items-center gap-[10px] pl-[20px]'>
            {/* 대댓글 화살표 */}
            <img className='h-[32px] w-[32px]' src='/comment-arrow.png' alt='replyImg' />
            <div className='flex items-center gap-[10px] p-[10px]'>
              <div className='flex items-center gap-[10px] p-[10px]' onClick={handleOpenModal}>
                <div className='h-[50px] w-[50px] rounded-full'>
                  <img className='h-full w-full rounded-full object-cover' src={reply.imageUrl} alt='profile-img' />
                </div>
                <div className='flex items-center text-[20px] font-semibold'>{reply.nickname}</div>
              </div>
              <div className='flex items-center text-[12px] text-[#AEAC9A]'>{changeDateWithFormat(reply.createdAt)}</div>
            </div>
            {userId === reply.userId && (
              <div className='ml-auto flex items-center gap-[10px] px-[10px]'>
                <div
                  className='flex cursor-pointer items-center p-[5px] text-[15px] font-semibold text-[#AEAC9A] hover:text-[#909700]'
                  onClick={() => handleEditClick(reply)} // 수정 버튼 클릭 시
                >
                  수정
                </div>
                <div
                  className='flex cursor-pointer items-center p-[5px] text-[15px] font-semibold text-[#AEAC9A] hover:text-[#909700]'
                  onClick={() => onDelete(reply.postId, reply.commentId)} // 여기서 콜백 호출
                >
                  삭제
                </div>
              </div>
            )}
          </div>
          {isEditing[reply.commentId] ? (
            // 수정 모드일 때 textarea와 저장 버튼 표시
            <div className='relative pl-[130px]'>
              <div className='h-[100px] w-full rounded-[10px] bg-[#F3F3F2] p-[20px] text-[20px] outline-none'>
                <textarea
                  ref={contentRef}
                  className='h-full w-full rounded-[10px] bg-[#F3F3F2] p-[10px] text-[20px] outline-none'
                  value={editedContent[reply.commentId] || ''} // 상태와 연결된 value
                  onChange={(e) =>
                    setEditedContent((prevState) => ({
                      ...prevState,
                      [reply.commentId]: e.target.value, // 상태 업데이트
                    }))
                  }
                />
              </div>
              <button
                className='absolute right-[70px] top-[60px] rounded-[5px] bg-[#AEAC9A] px-[6px] py-[3px] font-bold text-white hover:bg-[#909700]'
                onClick={() => handleUpdateReply(reply)} // 저장 버튼 클릭 시 수정 처리
              >
                댓글 수정
              </button>
              <button
                className='absolute right-[20px] top-[60px] rounded-[5px] bg-[#AEAC9A] px-[6px] py-[3px] font-bold text-white hover:bg-[#909700]'
                onClick={() =>
                  setIsEditing((prevState) => ({
                    ...prevState,
                    [reply.commentId]: false,
                  }))
                } // 취소 버튼 클릭 시 수정 모드 해제
              >
                취소
              </button>
            </div>
          ) : (
            // 수정 모드가 아닐 때는 기존 댓글 내용 표시
            <div className='pl-[145px] text-[20px]'>{reply.content}</div>
          )}{' '}
        </div>
      ))}
    </div>
  );
};
