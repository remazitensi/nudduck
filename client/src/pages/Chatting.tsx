import React, { useState } from 'react';
import { inviteChat, checkChat } from '../apis/chatRoom-api';
import ChatCheck from '../components/chat/ChatCheck';
import ViewChat from '../components/chat/ViewChat';
import { ChatRoomData, CreateRoomData } from '../types/chat-type'
// import { useLocation } from 'react-router-dom'

interface ChattingProps {
  loggedInUserId: number;
  loggedInUserNickname: string;
  recipientId: number;
  recipientNickname: string;
}

const Chatting: React.FC<ChattingProps> = ({ loggedInUserId, recipientId, loggedInUserNickname, recipientNickname }) => {

  // const location = useLocation();
  // const{ roomId } = location.state || {}; // roomId를 이전 페이지에서 받아옴


  // const loggedInUserId = 1;
  // const loggedInUserNickname = "UserA";
  // const [message, setMessage] = useState('');

  // type 1:1 채팅방 생성 시 요청 데이터
  const [createData, setCreateData] = useState<CreateRoomData>({
    participants: [], // 참가자들을 받는 배열
  });

  //   // 더미데이터로 설정한 참가자 정보
  // const loggedInUserId = 1; // // 가상의 사용자 ID
  // const recipientId = 2;     // 가상의 상대방 ID
  // const loggedInUserNickname = ''; // 가상의 사용자 닉네임
  // const recipientNickname = 'UserB';  // 가상의 상대방 닉네임

  // type 채팅방 데이터 구조
  const [ChatData, setChatData] = useState<ChatRoomData>({
    roomId: '', // 채팅방 ID 
    participants: [], // 참가자 ID 목록
    // messages: [] // messages 필드 추가
  })

  // const [selectedChat, setSelectedChat] = useState<null | {roomId: number, message: Array<{ name: string; msg: string; time: string }> }>(null);
  const [chatHistory, setChatHistory] = useState<Array<{ name: string; msg: string; time: string }>>([]);
  

  // 메시지 전송 시, 새로운 메시지를 chatHistory에 추가하는 함수 임시
  const handleSendMessage = (newMessage: { name: string; msg: string; time: string }) => {
    setChatHistory((prevHistory) => [...prevHistory, newMessage]); // 이전 메시지에 새로운 메시지 추가
  };

  // 채팅 시작 및 대화방 만들기
  const startChat = async (loggedInUserId: number, recipientId: number) => {
    try {
      console.log("inviteChat 호출 시작:")
      const response = await inviteChat(loggedInUserId, recipientId, loggedInUserNickname, recipientNickname);

      console.log("inviteChat 응답:", response); // api 응답 확인

      // 대화방 생성 api 호출
      if (response && response.roomData) {  // 대화방 정보가 제대로 반환되었는지 확인
        
        const newRoom = response.roomData;
        console.log("새로운 방의 roomId:', newRoom.roomId")

        // 대화방 정보 설정
        // setCreateData((prevData) => ({
        //   ...prevData, // type을 사용
        //   participants: [loggedInUserId, recipientId], // 숫자 배열로 설정 nickname으로 하니 바로 에러가 뜸 배열의 타입 불일치
        //  }));

        // 방 생성 후 바로 채팅방 선택
        setChatData({
          roomId: newRoom.roomId,
          participants: [loggedInUserId, recipientId],
          // messages: newRoom.messages || [], // 메시지 초기화
        }); // 새로 생성된 대화방을 선택

        // roomId가 설정된 후에 로그 출력
        console.log("방 생성 후 roomId 확인:", newRoom.roomId);

        setChatHistory(newRoom.messages || []); // 새로 생성된 대화방의 채팅 이력 설정
        // 새로 생성된 대화방의 채팅 이력 설정
      } else {
        console.error('No roomData returned from inviteChat');
      }
    } catch (error) {
      console.error('Failed to startChat:', error);
    }
  };

  // 채팅 선택 시 호출되는 함수 - GPT에서 chatData <ViewChat chatData={selectedChat} 이 부분이 빨간줄을 막기 위해 checkChat api를 사용하라고 함
  const handleChatSelect = async (chat: any) => {
    try {
      const chatResponse = await checkChat(chat.roomId); // 특정 채팅방 조회
      setChatData(chatResponse);
      setChatHistory(chatResponse.messages);
    } catch (error) {
      console.error('Failed to load chat data:', error);
    }
    // setSelectedChat(chat); // 선택된 채팅 설정
    // setChatHistory(chat.messages); // 선택된 채팅의 메시지로 채팅 이력 설정
  };

  return (
    <div className='chatting flex flex-col items-center'>
      <div className='mt-[140px] flex flex-col items-center'>
        <div className='text-[28px] font-bold text-black'>커뮤니티</div>
        <div className='mt-[10px] w-[100px] border-b-2 border-[#8D8B67]'></div>
      </div>

      <div className='mt-[90px] flex w-[1300px] justify-center'>
        <div className='flex gap-[30px]'>
          {/* 채팅 선택 시 함수 호출  onChatSelect={handleChatSelect} */ }
          <ChatCheck rooms={[]} onChatSelect={handleChatSelect} />
          {/* 선택된 채팅과 이력 전달 */}
          <ViewChat chatData={ChatData} chatHistory={chatHistory} loggedInUserId={loggedInUserId} loggedInUserNickname={loggedInUserNickname} />
        </div>
      </div>

    </div>
  );
};

export default Chatting;
