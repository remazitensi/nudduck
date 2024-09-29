import React, { useState, useEffect } from 'react';
import { inviteChat, checkChat } from '../apis/chatRoom-api';
import ChatCheck from '../components/chat/ChatCheck';
import ViewChat from '../components/chat/ViewChat';
import { ChatRoomData, CreateRoomData } from '../types/chat-type'
// import { useLocation } from 'react-router-dom'
import socket from '../pages/socket'

interface ChattingProps {
  loggedInUserId: number;
  loggedInUserNickname: string;
  recipientId: number;
  recipientNickname: string;
  chatData: string;
  messages: string;
  setChatData: {
    roomId: '', // 채팅방 ID 더미 데이터
    participants: [], // 참가자 ID 목록
    messages: [] // messages 필드 추가
  }
}

const Chatting: React.FC<ChattingProps> = ({ loggedInUserId, recipientId}) => { // loggedInUserId, recipientId, loggedInUserNickname, recipientNickname,
  const [selectedChat, setSelectedChat] = useState<ChatRoomData | null>(null); // 선택된 채팅방 데이터를 저장하는 상태
  const [chatHistory, setChatHistory] = useState<Array<{ name: string; msg: string; time: string }>>([]); // 채팅 메시지들 저장

  // const [rooms, setRooms] = useState<ChatRoomData>([
  //   // 더미 데이터 사용 예시. 실제 데이터는 API로부터 받아오게 됩니다.
  //   // { roomId: '1', participants: [], messages: [{ name: '사용자1', msg: '안녕하세요', time: '12:30' }] },
  // ]);

   // 채팅방 선택 시
   const handleChatSelect = (chat: ChatRoomData) => {
    setSelectedChat(chat);
    setChatHistory(chat.messages || []); // 선택된 채팅방의 메시지로 chatHistory 설정
  };

  // type 채팅방 데이터 구조
  // const [ChatData, setChatData] = useState<ChatRoomData>({
  //   roomId: 'ㅎ2', // 채팅방 ID 더미 데이터
  //   participants: [], // 참가자 ID 목록
  //   messages: [] // messages 필드 추가
  // })


  // 채팅방을 선택하면 소켓을 통해 실시간 메시지 수신
  useEffect(() => {
    socket.on('message', (message: { name: string; msg: string; time: string }) => {
      setChatHistory((prevMessages) => [...prevMessages, message]); // 새로운 메시지를 추가
    });

    return () => {
      socket.off('message'); // 컴포넌트 언마운트 시 소켓 이벤트 해제
    };
  }, [selectedChat]); // selectedChat을 의존성 배열에 넣은 이유는, 사용자가 채팅방을 변경할 때마다 해당 방에 맞는 소켓 이벤트를 다시 설정하기 위함. 이럴 경우 selectedChat이 변경때마다 수신한 메시지 이벤트 정리, 새로운방에 맞춰 메시지 수신

  // 메시지 전송 처리 함수
  const handleSendMessage = (message: string) => {
    if (selectedChat && message.trim()) {
      const newMessage = {
        name: '로그인한 유저', // 예시 사용자 이름
        msg: message,
        time: new Date().toLocaleTimeString(),
      };
      // 메시지를 서버에 전송
      socket.emit('sendMessage', { roomId: selectedChat.roomId, message });
      // 로컬에서도 메시지 추가
      setChatHistory((prev) => [...prev, newMessage]);
    }
  };
  

  // // 채팅 시작 및 대화방 만들기 여기가 아닌거 같다 chatCheck에 넣어둠
  // const startChat = async (loggedInUserId: number, recipientId: number) => {
  //   try {
  //     console.log("inviteChat 호출 시작:")
  //     const response = await inviteChat(loggedInUserId, recipientId);

  //     console.log("inviteChat 응답:", response); // api 응답 확인

  //     // 대화방 생성 api 호출
  //     if (response && response.roomData) {  // 대화방 정보가 제대로 반환되었는지 확인
        
  //       const newRoom = response.roomData;
  //       console.log("새로운 방의 roomId:', newRoom.roomId")

  //       // 방 생성 후 바로 채팅방 선택
  //       setChatData({
  //         roomId: newRoom.roomId,
  //         participants: [loggedInUserId, recipientId],
  //         // messages: newRoom.messages || [], // 메시지 초기화
  //       }); // 새로 생성된 대화방을 선택

  //       // roomId가 설정된 후에 로그 출력
  //       console.log("방 생성 후 roomId 확인:", newRoom.roomId);

  //       setChatHistory(newRoom.messages || []); // 새로 생성된 대화방의 채팅 이력 설정
  //       // 새로 생성된 대화방의 채팅 이력 설정
  //     } else {
  //       console.error('No roomData returned from inviteChat');
  //     }
  //   } catch (error) {
  //     console.error('Failed to startChat:', error);
  //   }
  // };


  return (
    <div className='chatting flex flex-col items-center'>
      <div className='mt-[140px] flex flex-col items-center'>
        <div className='text-[28px] font-bold text-black'>커뮤니티</div>
        <div className='mt-[10px] w-[100px] border-b-2 border-[#8D8B67]'></div>
      </div>

      <div className='mt-[90px] flex w-[1300px] justify-center'>
        <div className='flex gap-[30px]'>
          {/* 채팅 선택 시 함수 호출  onChatSelect={handleChatSelect} */ }
          <ChatCheck rooms={[1, 2]} onChatSelect={handleChatSelect} onChatHistoryUpdate={setChatHistory} recipientId={recipientId}
            loggedInUserId={loggedInUserId} />
          
          {/* 선택된 채팅방이 있으면 ViewChat을 렌더링 */}
          {/* 목록이 있을 경우 목록을 클릭할때까지 없는 상태로 나오고, 목록이 없다면 아래와 같은 내용으로 커뮤니티로 리다이렉트하고자 함*/}
          {selectedChat ? (
            <ViewChat
            chatData={selectedChat}
            chatHistory={chatHistory} // 부모 상태에서 chatHistory 전달
            loggedInUserId={loggedInUserId}
            loggedInUserNickname={'나와 나'}
            onChatSelect={handleChatSelect} // 방 선택 함수 전달
          />
          ) :   
          ( chatHistory.length === 0 ? (
            <div className='w-[900px] h-[800px] flex flex-col justify-center items-center'>
                  <div className='text-[48px] font-bold'>채팅 목록이 조회가 되지 않으시나요?</div>
                    <div className='mt-[100px] w-[300px] h-[50px] border rounded-[10px] bg-blue-300 flex justify-center cursor-pointer hover:bg-blue-500 hover:text-white'>
                    <button className='text-[24px] font-bold'>커뮤니티로 돌아가기</button>
                  </div>
              </div>   
            ) : null
          )}
        </div>
      </div>

    </div>
  );
};

export default Chatting;
