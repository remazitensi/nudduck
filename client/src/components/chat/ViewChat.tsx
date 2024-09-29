import React, { useEffect, useRef, useState } from 'react';
import socket from '../../pages/socket';
import SendButton from './SendButton';
import { whichCheckchatRoom } from '../../apis/chatRoom-api';
import { ChatMessageData } from '../../types/chat-type';

interface ChatMessage {
  id: string;
  name: string;
  msg: string;
  time: string;
  
}

interface ViewChatProps {
  chatData: {roomId: string; } | null; // null을 빼게 되면 chatting.tsx 69번째 chatData가 에러가 남 아마 정보를 받지 못해서 에러가 나는게 아닌가 싶음  message: Array<{ name: string; msg: string; time: string }>
  chatHistories: { [roomId: string]: Array<ChatMessage> }; // 방별로 관리되는 대화 기록
  loggedInUserId: number;
  loggedInUserNickname: string;
  onChatSelect: (roomId: string) => void;
  
}
const ViewChat: React.FC<ViewChatProps> = ({ chatData, loggedInUserId, loggedInUserNickname, chatHistories }) => {  // 프롭으로 

  const [chatHistory, setChatHistory] = useState<Array<{ name: string; msg: string; time: string }>>([]);
  const [localChatHistory, setLocalChatHistory] = useState<Array<ChatMessage>>();

  useEffect(() => {
    if (chatData) {
      // 채팅방에 맞는 기록을 API로 다시 가져오는 경우가 있을 때 여기서 처리 가능
      setLocalChatHistory(chatHistory);
    }
  }, [chatData, chatHistory]);

  // 메시지 수신 처리 소켓사용
  useEffect(() => {
    socket.on('message', (message: { name: string; msg: string; time: string }) => {
      console.log('message:', message);
      setChatHistory((prevMessages) => [...prevMessages, message]);
    });

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      socket.off('message');
    };
  }, [chatData]);

  // 메시지 목록의 각 항목을 참조하기 위한 ref 배열
  const messageRefs = useRef<Array<HTMLLIElement | null>>([]);

  // 채팅 목록의 마지막 요소를 참조하기 위한 ref
  const scrollToBottomRef = useRef<HTMLDivElement>(null);

  // 새로운 메시지가 추가될 때 자동으로 하단으로 스크롤
  useEffect(() => {
    if (scrollToBottomRef.current) {
      scrollToBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory]);


  // 메시지 전송 처리 함수
  const handleSendMessage = (message: string) => {
    // socket을 통해 메시지 전송
    if (chatData && chatData.roomId) {
      // socket.emit('sendMessage', {
      //   roomId: chatData.roomId,
      //   message,
      //   userId: loggedInUserId,
      //   userName: loggedInUserNickname,
      // });

      // 전송된 메시지를 채팅 기록에 추가
      setChatHistory((prev) => [
        ...prev,
        { id: Date.now().toString(), name: loggedInUserNickname, msg: message, time: new Date().toLocaleTimeString() }, // 로컬에서 테스트 하기 위한 Date.now().toString() 사용하여 id 생성
      ]);
    } else {
      console.error('Room is not defined');
    }
  };

  return (
    <div className='ID-container h-[1000px] w-[970px] rounded-[30px] border border-[#8D8B67]'>
      <div className='flex h-[100px] w-full items-center rounded-t-[30px] border bg-[#EEF9FF] pl-[30px]'>
        <div className='pl-[30px] text-[24px] font-bold'>채 팅 방</div> {/* roomId가 없을 경우 표시 chatroomName 으로 하려 했으나 에러로 어떻게 풀어야 할지??*/}
      </div>
      {/* 메시지 표시 영역 */}
      <div className='Display-container flex h-[800px] w-full border-b-[1px] border-[#59573D]'>
        <ul className='Chatting-list h-[600px]] flex w-full flex-col gap-[10px] overflow-y-auto p-[20px]'>
        {chatHistory.length > 0 ? (
            chatHistory.map((ChatMessage, index) => (
              <li
                key={index}
                className={`flex items-start gap-[10px] ${ChatMessage.name ? 'flex-row-reverse' : ''}`}
              >
                <img className="h-[100px] w-[100px] object-cover" src="/cat_image.png" alt="고양이 이미지" />
                <div className="flex max-w-[80%] flex-col justify-end gap-[5px]">
                  <div className={`flex ${ChatMessage.name ? 'justify-end' : ''}`}>
                    <div className="text-[20px] font-bold">{ChatMessage.name}</div>
                  </div>
                  <div className="flex items-start gap-[5px]">
                    <span className={`max-w-[300px] break-words rounded-[10px] p-3 text-[20px] shadow-xl ${ChatMessage.name ? 'bg-[#EEF9FF]' : 'bg-[#FFEABA]'}`}>
                      {ChatMessage.msg}
                    </span>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <div>메시지가 없습니다.</div> // 메시지가 없을 때 처리
          )}
          {/* 빈 div로 스크롤 하단 유지 */}
          <div ref={scrollToBottomRef}></div>
        </ul>
      </div>
      {/* SendButton에 필요한 프롭 전달 */}
      <SendButton 
      roomId={chatData?.roomId}
      loggedInUserId={loggedInUserId}
      loggedInUserNickname={loggedInUserNickname}
      onClick={handleSendMessage} // 메시지 전송을 처리하는 함수 전달
       />
    </div>
  );
};

export default ViewChat;