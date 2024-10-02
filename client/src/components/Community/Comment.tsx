/**
 * File Name    : Comment.tsx
 * Description  : 부모 댓글 컴포넌트
 * Author       : 김민지
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.28    김민지      Created
 */

import { useRef, useState } from 'react';
import { deleteComment, updateComment } from '../../apis/community/community-comments-api';
import { CommentsDto } from '../../types/comments-type';
import { changeDateWithFormat } from '../../utils/change-date-with-format';
import AnotherUserModal from './AnotherUserModal';

export const Comment: React.FC<{ comment: CommentsDto; isWriter: boolean; onDelete: () => void; onReply: () => void }> = ({ comment, isWriter, onDelete, onReply }) => {
  const createdAt = changeDateWithFormat(comment.createdAt);
  const [openUserModal, setOpenUserModal] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false); // 수정 모드 상태
  const [editedContent, setEditedContent] = useState<string>(comment.content); // 수정된 댓글 내용
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const handleOpenModal = () => {
    setOpenUserModal(true);
  };

  const handleCloseModal = () => {
    setOpenUserModal(false);
  };

  const handleDeleteComment = async () => {
    let flag = confirm('삭제 하시겠습니까?');
    if (flag == true) {
      try {
        await deleteComment(comment.postId, comment.commentId);
        onDelete(); // 상위 컴포넌트에 삭제를 알림
      } catch (err) {
        // 에러 처리
      }
    }
  };

  const handleUpdateComment = async () => {
    const data = {
      content: contentRef.current ? contentRef.current.value : '', // textarea의 값 참조
      postId: comment.postId,
      commentId: comment.commentId,
    };

    if (data.content === '') {
      return alert('댓글을 입력해주세요!');
    }
    try {
      await updateComment(comment.postId, comment.commentId, data); // 댓글 생성 API 호출
      if (contentRef.current) contentRef.current.value = ''; // 댓글 입력란 초기화
      comment.content = data.content;
      setEditedContent(data.content);
      alert('댓글 수정에 성공했습니다! 😎');
      setIsEditing(false);
    } catch (error) {
      alert('댓글 수정에 실패했습니다.😢');
    }
  };

  return (
    <div>
      {openUserModal && <AnotherUserModal onClose={handleCloseModal} userId={comment.userId} />}

      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-[10px] p-[10px]'>
          <div className='flex items-center gap-[10px] p-[10px]' onClick={handleOpenModal}>
            <div className='h-[50px] w-[50px] rounded-full'>
              <img className='h-full w-full rounded-full object-cover' src={comment.imageUrl} alt='profile-img' />
            </div>
            <div className='flex items-center text-[20px] font-semibold'>{comment.nickname}</div>
          </div>
          <div className='flex items-center text-[12px] text-[#AEAC9A]'>{createdAt}</div>
          <div className='flex cursor-pointer items-center p-[5px] text-[16px] font-semibold text-[#AEAC9A] hover:text-[#909700]' onClick={onReply}>
            대댓글 달기
          </div>
        </div>
        {isWriter && (
          <div className='flex items-center gap-[10px] px-[10px]'>
            <div
              className='flex cursor-pointer items-center p-[5px] text-[15px] font-semibold text-[#AEAC9A] hover:text-[#909700]'
              onClick={() => setIsEditing(true)} // 수정 버튼 클릭 시 수정 모드로 전환
            >
              수정
            </div>
            <div className='flex cursor-pointer items-center p-[5px] text-[15px] font-semibold text-[#AEAC9A] hover:text-[#909700]' onClick={() => handleDeleteComment()}>
              삭제
            </div>
          </div>
        )}
      </div>

      {isEditing ? (
        // 수정 모드일 때 textarea와 저장 버튼 표시
        <div className='relative pl-[70px]'>
          <div className='h-[100px] w-full rounded-[10px] bg-[#F3F3F2] p-[20px] text-[20px] outline-none'>
            <textarea
              ref={contentRef}
              className='h-full w-full rounded-[10px] bg-[#F3F3F2] p-[10px] text-[20px] outline-none'
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
          </div>
          <button
            className='absolute right-[70px] top-[60px] rounded-[5px] bg-[#AEAC9A] px-[6px] py-[3px] font-bold text-white hover:bg-[#909700]'
            onClick={handleUpdateComment} // 저장 버튼 클릭 시 수정 처리
          >
            댓글 수정
          </button>
          <button
            className='absolute right-[20px] top-[60px] rounded-[5px] bg-[#AEAC9A] px-[6px] py-[3px] font-bold text-white hover:bg-[#909700]'
            onClick={() => {
              setIsEditing(false);
            }} // 저장 버튼 클릭 시 수정 처리
          >
            취소
          </button>
        </div>
      ) : (
        // 수정 모드가 아닐 때는 기존 댓글 내용 표시
        <div className='pl-[80px] text-[20px]'>{comment.content}</div>
      )}
    </div>
  );
};
