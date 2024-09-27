import React from 'react';
import { useNavigate } from 'react-router-dom';
import { inviteChat } from '../apis/chatRoom-api';

const Previous = () => {
  const loggedInUserId = 1; // 예시 사용자 ID
  const recipientId = 2;    // 예시 상대방 ID
  const loggedInUserNickname = "UserA";
  const recipientNickname = "UserB";
  
  const navigate = useNavigate();

  const handleStartChat = async () => {
    try {
      const response = await inviteChat(loggedInUserId, recipientId, loggedInUserNickname, recipientNickname);
      if (response && response.roomData) {
        const roomId = response.roomData.roomId;
        console.log("방 생성 성공:", roomId);

        // 방 생성 후 Chatting.tsx로 이동, roomId를 함께 전달
        navigate(`/chatting`, { state: { roomId } });
      } else {
        console.error("방 생성 실패");
      }
    } catch (error) {
      console.error('Failed to startChat:', error);
    }
  };

  return (
    <div>
      <h1>이전 페이지</h1>
      <button onClick={handleStartChat}>1:1 대화 시작</button>
    </div>
  );
};

export default Previous;