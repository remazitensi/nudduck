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
  chatHistory: Array<{ name: string; msg: string; time: string }>;
  loggedInUserId: number;
  loggedInUserNickname: string;
}
const ViewChat: React.FC<ViewChatProps> = ({ chatData, loggedInUserId, loggedInUserNickname }) => {
  // type 생성
  const [createData, setCreateData] = useState({
    participants: [],
  });
  // type 생성
  // const [chatData, setChatData] = useState<ChatMessageData>({
  //   messageId: '',
  //   userId: 0,
  //   chatroomId: '',
  //   content: '',
  //   createdAt: new Date(),
  // });

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  // const [messages, setMessages] = useState([]);
  // const [inputMessage, setInputMessage] = useState('');

  

  // 메시지 수신 처리 소켓사용
  useEffect(() => {
    socket.on('message', (message: ChatMessage) => {
      console.log('message:', message);
      setChatHistory((prevMessages) => [...prevMessages, message]);
    });

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      socket.off('message');
    };
  }, []);

  // 특정 채팅방의 메시지 조회
  const whichFindChatRoom = async () => {
    if(chatData) {
      try {
        const roomId = chatData.roomId; // roomId는 string 타입
        console.log("roomId: ", roomId);
        const response = await whichCheckchatRoom(roomId); // api의 roomId를 받아와서 사용하고자 함
        setChatHistory(response.messages || []); // 해당 방에 있는 메시지를 가져오고자 함 배열로 처리
      } catch (error) { // 에러 발생시 콘솔에 아래 메시지가 뜨도록 함
        console.error('Failed to check Chat room');
      }
    } else {
      console.log('chatData가 null입니다')
    }
  };

  useEffect(() => {
    whichFindChatRoom(); // 컴포넌트가 마운트되면 채팅방 메시지를 조회
  }, [chatData])

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

  // 특정 메시지를 클릭하면 해당 메시지로 스크롤 이건 필요없지 않을까? 특정 메시지 즉 개인을 클릭하면 방이 변경이 되는데 스크롤이 굳이 필요할까?
  // const scrollToMessage = (index: number) => {
  //   const targetElement = messageRefs.current[index];
  //   if (targetElement) {
  //     targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  //   }
  // };

  return (
    <div className='ID-container h-[1000px] w-[970px] rounded-[30px] border border-[#8D8B67]'>
      <div className='flex h-[100px] w-full items-center rounded-t-[30px] border bg-[#EEF9FF] pl-[30px]'>
        <div>{chatData?.roomId || 'No Room Selected'}</div> {/* roomId가 없을 경우 표시 chatroomName 으로 하려 했으나 에러로 어떻게 풀어야 할지??*/}
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
      <SendButton 
        onClick={() => { /* 메시지 전송 처리 */ }} 
        roomId={chatData?.roomId || ''}  // chatData에서 roomId 가져오기 roomId가 없을 경우 빈값을 전달
        loggedInUserId={loggedInUserId} 
        loggedInUserNickname={loggedInUserNickname}
       />
    </div>
  );
};

export default ViewChat;