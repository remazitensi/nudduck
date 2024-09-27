import React, { useState, useEffect } from 'react';
import { ChatRoomData } from '../../types/chat-type';
import ScrollToBottom from '../chatSkill/ScrollToBottom';
import { checkChat } from '../../apis/chatRoom-api';

interface ChatCheckProps {
  onChatSelect: (chat: ChatRoomData) => void; // 부모로부터 전달받은 함수
  rooms: Array<number>;
  // onSelectRoom: number;
}

const ChatCheck: React.FC<ChatCheckProps> = ({ onChatSelect, rooms }) => {
  const [chatData, setChatData] = useState<ChatRoomData>({
    // type 선언 채팅방 데이터 구조
    roomId: '',
    participants: [],
  });

  const [chatHistory, setChatHistory] = useState<Array<{ name: string; msg: string; time: string }>>([]);
  const [ message, setMessage ] = useState<string>(''); // 사용자가 입력한 메시지 상태


  const loggedInUserId = 1; // 예시: 로그인한 사용자 ID
  const loggedInUserNickname = ''; // 예시: 로그인한 사용자 닉네임
  const recipientId = 2; // 예시: 대화 상대 ID
  const recipientNickname = 'UserB'; // 예시: 대화 상대 닉네임

  // 채팅방 목록 조회
  const chatCheck = async () => {
    try {
      const response = await checkChat(recipientId); // recipientId를 통해서 채팅 목록 조회 시 상대 유저 아이디
      setChatData(response); // 해당 목록 조회 상대 아이디를 setChatData에 담는다
    } catch (error) { // 에러시 아래 에러 코드가 나온다
      console.error('Failed to check chat:', error);
    }
  }

  // 컴포넌트 마운트 시 채팅방 조회
  useEffect(() => {
    chatCheck(); // 초기 채팅방 조회
  }, []) // 빈 배열로 의존성 지정하여 마운트 시 한 번만 호출


  // 채팅 항목 클릭 시 해당 채팅 정보 선택
  const handleChatClick = (chat: any) => {
    onChatSelect(chat); // 부모 컴포넌트의 함수 호출
  };

  return (
    <div className='Left-list h-[1000px] w-[300px] rounded-[30px] border border-[#8D8B67] bg-[#EEF9FF]'>
      <div className='flex h-[100px] w-[300px] flex-col items-center justify-center rounded-t-[30px] border border-b-[#8D8B67]'>
        <p className='text-[25px]'>1:1 채팅 목록</p>
      </div>
      <div className='h-[calc(100%_-_100px)] p-[15px]'>
        {/* Adjust height to fill the container */}
        <div className='h-full w-full'>
          <ul className='flex h-[850px] flex-col gap-[10px] overflow-y-auto p-[10px]'>
            {chatHistory.map((rooms, index) => (
              <li
                key={index}
                // onClick={() => scrollToMessage(index)} // 클릭 시 해당 메시지로 이동
                onClick={() => handleChatClick(rooms)} // 클릭 시 채팅 선택
                className='flex cursor-pointer flex-col gap-[10px] rounded-[5px] border border-white bg-white pl-[30px] pt-[10px] text-[20px] hover:border-[#A1DFFF]'
              >
                <div className='flex items-center gap-[5px]'>
                  <img className='h-[30px] w-[30px] object-cover' src='/cat_image.png' alt='고양이 이미지' />
                  <div className='mt-[5px] text-[20px]'>{rooms.name}</div>
                </div>
                <div className=''>{rooms.msg}</div>
              </li>
            ))}
            {/* 빈 div로 스크롤 하단 유지 */}
            <ScrollToBottom chatHistory={chatHistory} />
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ChatCheck;
