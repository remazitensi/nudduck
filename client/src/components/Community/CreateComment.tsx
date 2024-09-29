import { useRef } from 'react';
import { createComment } from '../../apis/community/community-reply-api';

export const CreateComment = ({ postId, onCommentCreated }: { postId: number; onCommentCreated: () => void }) => {
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async () => {
    const data = {
      content: contentRef.current ? contentRef.current.value : '', // textarea의 값 참조
      postId: postId,
    };

    if (data.content === '') {
      return alert('댓글을 입력해주세요!');
    }

    try {
      await createComment(postId, data); // 댓글 생성 API 호출
      if (contentRef.current) contentRef.current.value = ''; // 댓글 입력란 초기화
      onCommentCreated(); // 부모 컴포넌트에 알림
    } catch (error) {
      console.error('댓글 생성 실패:', error);
    }
  };

  return (
    <div className='relative'>
      <div className='mt-[19px] h-[150px] w-[1200px] rounded-[10px] bg-[#F3F3F2] p-[20px] text-[24px] outline-none'>
        <textarea ref={contentRef} className='h-full w-full bg-[#F3F3F2] text-[24px] outline-none' placeholder='댓글을 입력해 주세요'></textarea>
      </div>
      <button
        onClick={handleSubmit} // 버튼 클릭 시 API 호출
        className='absolute right-[20px] top-[90px] h-[40px] w-[95px] rounded-[5px] bg-[#AEAC9A] font-bold text-white hover:bg-[#909700]'
      >
        댓글달기
      </button>
    </div>
  );
};
