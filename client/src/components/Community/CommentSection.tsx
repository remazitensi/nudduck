/**
 * File Name    : CommentSection.tsx
 * Description  : 댓글 목록 컴포넌트
 * Author       : 김민지
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.28    김민지      Created
 */

import axios from 'axios';
import { useEffect, useState } from 'react';
import { CommentsDto, UserInfo } from '../../types/comments-type';
import { CommentThread } from './CommentThread';

export const CommentSection: React.FC<{ comments: CommentsDto[] }> = ({ comments }) => {
  // 초기 상태는 null로 설정하고, UserInfo 타입 지정
  const [info, setInfo] = useState<UserInfo | null>(null);

  // 로그인 유저(이용자) 정보 호출 API
  const userInfo = async (): Promise<UserInfo | void> => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/my/info`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`, // 엑세스 토큰 포함
        },
        withCredentials: true, // 쿠키 포함 설정
      });
      setInfo(response.data);
      return response.data;
    } catch (error: any) {
      // return alert(error.message);
    }
  };

  useEffect(() => {
    userInfo();
  }, []);

  return (
    <div>
      {/* comments 배열이 null 또는 undefined일 때 빈 배열로 처리 */}
      {comments.length > 0 ? (
        comments.map((comment) => (
          <CommentThread key={comment.commentId} comment={comment} userId={info?.id || 0} /> // userId가 없을 경우 0 전달
        ))
      ) : (
        <div>댓글이 없습니다.</div>
      )}
    </div>
  );
};
