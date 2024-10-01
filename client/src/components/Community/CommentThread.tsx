/**
 * File Name    : CommentThread.tsx
 * Description  : 부모 댓글을 기준으로 댓글과 대댓글을 묶은 컴포넌트
 * Author       : 김민지
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.28    김민지      Created
 */
import { useRef, useState } from 'react';
import { createReply, deleteReply, getReply } from '../../apis/community/community-comments-api';
import { CommentsDto } from '../../types/comments-type';
import { Comment } from './Comment';
import { Reply } from './Reply';

export const CommentThread: React.FC<{ comment: CommentsDto; userId: number }> = ({ comment, userId }) => {
  const [isReplyVisible, setIsReplyVisible] = useState(false);
  const [replies, setReplies] = useState<CommentsDto[]>([]);
  const [deleted, setDeleted] = useState(false); // 댓글 삭제 상태

  const [showCommentInput, setShowCommentInput] = useState(false); // 대댓글 입력창 상태 추가

  const isWriter = comment.userId === userId;

  // 대댓글 리스트 가져오는 함수
  const fetchReplyComment = async () => {
    try {
      const data = await getReply(comment.postId, comment.commentId);
      setReplies(data.replies); // 받은 데이터를 설정
      return data;
    } catch (error) {
      console.error('대댓글 불러오기 실패:', error);
      return { comments: [], total: 0 }; // 기본값을 반환
    }
  };

  // 댓글 보기/닫기 토글
  const toggleReplyVisibility = async () => {
    if (!isReplyVisible) {
      await fetchReplyComment(); // 대댓글 가져오기
    }
    setIsReplyVisible(!isReplyVisible);
  };

  // 대댓글 삭제 후 대댓글 리스트를 업데이트하는 함수
  const updateReplies = async () => {
    const updatedReplies = await fetchReplyComment();
    if (updatedReplies.total !== 0) {
      setReplies(updatedReplies.replies); // 업데이트된 대댓글 설정
    } else {
      setReplies([]); // 대댓글이 없으면 빈 배열로 설정
    }
  };

  // 대댓글 삭제 핸들러
  const handleDeleteReply = async (postId: number, commentId: number) => {
    let flag = confirm('삭제 하시겠습니까?'); //확인 취소 버튼
    if (flag == true) {
      const response = await deleteReply(postId, commentId);
      if (response.status === 200) {
        await updateReplies(); // 삭제 후 대댓글 리스트 업데이트
      }
    }
  };

  // 대댓글 입력창 토글
  const handleToggleCommentInput = () => {
    setShowCommentInput(!showCommentInput);
  };

  const contentRef = useRef<HTMLTextAreaElement>(null);

  // 대댓글 등록 핸들러
  const handleSubmit = async () => {
    const data = {
      content: contentRef.current ? contentRef.current.value : '',
      postId: comment.postId,
      parentId: comment.commentId,
    };

    if (data.content === '') {
      return alert('대댓글을 입력해주세요!');
    }

    try {
      await createReply(comment.postId, data);
      if (contentRef.current) contentRef.current.value = ''; // 대댓글 입력 후 textarea 초기화
      const updatedReplies = await fetchReplyComment(); // 대댓글 등록 후 최신 대댓글 리스트를 가져옴
      //최초 대댓글 작성 시에 토글 여는 동작
      if (comment.replyCount === 0) {
        comment.replyCount = 1;
        setIsReplyVisible(!isReplyVisible);
      }
      handleToggleCommentInput();
      await setReplies(updatedReplies.replies);
    } catch (error) {
      console.error('댓글 생성 실패:', error);
    }
  };

  // 댓글이 삭제되면 컴포넌트를 렌더링하지 않음
  if (deleted) return null;

  return (
    <div>
      <div className='mt-[10px] w-[1200px] border-b-2 border-[8D8B67]'></div>
      <Comment comment={comment} isWriter={isWriter} onDelete={() => setDeleted(true)} onReply={handleToggleCommentInput} />
      {/* 대댓글 input 영역 토글 */}
      {showCommentInput && (
        <div className='relative pl-[70px]'>
          <div className='mt-[19px] h-[100px] w-[1130px] rounded-[10px] bg-[#F3F3F2] p-[20px] text-[24px] outline-none'>
            <textarea ref={contentRef} className='h-full w-full bg-[#F3F3F2] text-[20px] outline-none' placeholder='댓글을 입력해 주세요'></textarea>
          </div>
          <button onClick={handleSubmit} className='absolute right-[20px] top-[50px] h-[40px] w-[95px] rounded-[5px] bg-[#AEAC9A] font-bold text-white hover:bg-[#909700]'>
            댓글달기
          </button>
        </div>
      )}
      <div className='ml-[70px] flex items-center gap-[10px] p-[10px]'>
        {/* 대댓글이 1개 이상일 때만 노출 */}
        {comment.replyCount > 0 && !isReplyVisible && (
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
      {/* 대댓글 리스트 렌더링 */}
      {isReplyVisible && <Reply replies={replies} userId={userId} onDelete={handleDeleteReply} />}{' '}
    </div>
  );
};
