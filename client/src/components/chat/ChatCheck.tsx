import React, { useState, useEffect } from 'react';
import { ChatRoomData } from '../../types/chat-type';
import ScrollToBottom from '../chatSkill/ScrollToBottom';
import { checkChat, whichCheckchatRoom, inviteChat } from '../../apis/chatRoom-api';
import ViewChat from './ViewChat';

interface ChatCheckProps {
  onChatSelect: (chat: ChatRoomData) => void; // 부모로부터 전달받은 함수 즉 채팅방 데이터
  onChatHistoryUpdate: (history: Array<{ name: string; msg: string; time: string }>) => void; // chatHistory를 부모로 전달하는 함수
  rooms: Array<number>;
  recipientId: number;
  loggedInUserId: number;
  roomId: string;
}

interface ChatMessage {
  id: number;
  name: string;
  msg: string;
  time: string;
}

const ChatCheck: React.FC<ChatCheckProps> = ({ onChatSelect, onChatHistoryUpdate, loggedInUserId, rooms, roomId, recipientId }) => {
  const [chatData, setChatData] = useState<ChatRoomData>({
    // type 선언 채팅방 데이터 구조
    roomId: '',
    participants: [],
  });
  const [chatHistories, setChatHistories] = useState<{ [roomId: string]: Array<{ id: number; name: string; msg: string; time: string }> }>({}); // 별도의 대화 기록을 유지
  const [dummyRooms, setDummyRooms] = useState<Array<ChatMessage>>([ // 채팅방 목록이 더미 데이터로 정의된 상태 실제로 방이 생성되지 않았을 때 임시로 표시할 채팅방 목록
    { id: 1, name: '고양이 방', msg: '안녕하세요', time: '10:30' },
    { id: 2, name: '강아지 방', msg: '반가워요', time: '11:30' },
  ]);


  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);

  useEffect(() => {
    if (selectedRoomId !== null) {
      const room = dummyRooms.find((room) => room.id === selectedRoomId);
      if (room) {
        handleChatClick(room);
      }
    }
  }, [selectedRoomId]);


  // 1:1 대화 목록 없을 시 방 만들어 주는 함수
  const handleCreateRoom = async (recipientId: number) => {
    try {
      const response = await inviteChat(loggedInUserId, recipientId)
      const newRoomId = response.data.roomId; // roomData

      setSelectedRoomId(newRoomId);

     // 새로운 방이 생성되면 해당 방으로 바로 이동
     const newChatRoom: ChatRoomData = {
      roomId: newRoomId,
      participants: [loggedInUserId, recipientId],
      messages: chatHistories[roomId] || [], // 방에 해당하는 메시지를 전달
    };

    onChatSelect(newChatRoom);
    onChatHistoryUpdate([]); // 새로운 방이므로 대화 기록은 빈 배열로 설정
  } catch (error) {
    console.error('Failed to create chat room:', error);
  }
};

  // 특정 채팅방 조회 즉 목록 클릭 시 채탕방이 생성되도록 메시지를 불러오도록 하는 함수
  const handleChatClick = async (room: { id:number; name: string; msg: string; time: string }) => {
    try {
      const roomId = room.id; // 방의 id를 가져옵니다 (실제 구현에서는 다른 ID 시스템을 사용할 수도 있음)
      setSelectedRoomId(room.id) 

      if (!chatHistories[roomId]) {
        // 선택한 방에 대한 기록이 없으면 API 호출
        const chatMessages = await whichCheckchatRoom(roomId);

        setChatHistories((prevHistories) => ({
          ...prevHistories,
          [roomId]: chatMessages.messages || [],
        }));

        onChatHistoryUpdate(chatMessages.messages || []);
      } else {
        // 이미 기록이 있으면 기존 기록을 사용
        onChatHistoryUpdate(chatHistories[roomId]);
      }

      // 선택된 방 데이터를 부모로 전달
      onChatSelect({
        roomId,
        participants: [loggedInUserId, recipientId],
        messages: chatHistories[roomId] || [],
      });
    } catch (error) {
      console.error('Failed to load chat room messages:', error);
    }
    // try {
    //   const selectedChat: ChatRoomData = {
    //     roomId: room.name, // 임의로 roomId 설정
    //     participants: [1, 2], // 더미 데이터
    //     messages: [room], // 메시지 배열로 추가
    //   };

    //   // 부모 컴포넌트로 선택한 채팅 데이터 전달
    //   onChatSelect(selectedChat);

    //   // whichCheckchatRoom API를 통해 채팅방의 메시지 데이터를 가져옴
    //   const chatMessages = await whichCheckchatRoom(selectedChat.roomId);

    //   // // 가져온 채팅 기록을 setChatHistory로 업데이트
    //   // setChatHistory(chatMessages.messages || []) // 기존의 더메 데이터를 덮어 쓰는방식이므로 일단 주석으로

    //   // 기존의 더미 데이터를 유지하면서 새로 가져온 데이터를 추가
    //   setChatHistory((prevChatHistory) => [
    //     ...prevChatHistory, // 기존의 더미 데이터 유지
    //     ...(chatMessages.messages || []), // API에서 가져온 데이터 추가
    //   ]);

    //   // 부모 컴포넌트로도 업데이트 된 chatHistory 전달
    //   onChatHistoryUpdate(chatMessages.messages || []);
    // } catch (error) {
    //     console.log('Failed to load chat room messages:', error);
    // }
  };

  useEffect(() => {
    // 방 조회 로직 또는 초기 방 데이터 처리 (예: dummy 방)
    if (dummyRooms.length === 0) {
      handleCreateRoom(recipientId); // 방이 없을 경우 방 생성
    }
  }, [dummyRooms, recipientId]);



  // 채팅방 목록 조회
  const chatCheck = async () => {
    try {
      // const recipientId = 123;
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


  // 채팅목록에서 특정한 목록을 선택할 경우 우측 채팅방이 나타나도록 구현하는 함수 및 api
  const selectedChatRoom = async (roomId:any) => {
    try {
      const response = await whichCheckchatRoom(roomId);
      setChatHistories(response);
    } catch (error) {
      console.log('Failed to selectedChatRoom:', error)
    }
  }

  return (
    <div className='Left-list h-[1000px] w-[300px] rounded-[30px] border border-[#8D8B67] bg-[#EEF9FF]'>
      <div className='flex h-[100px] w-[300px] flex-col items-center justify-center rounded-t-[30px] border border-b-[#8D8B67]'>
        <p className='text-[25px]'>1:1 채팅 목록</p>
      </div>
      <div className='h-[calc(100%_-_100px)] p-[15px]'>
        <div className='h-full w-full'>
          {dummyRooms.length === 0 ? (
            // 채팅 목록이 없을 때 표시할 메시지
            <div className='flex h-full items-center justify-center text-[#8D8B67]'>
              해당 조회를 찾을 수 없습니다.
            </div>
          ) : (
            // 채팅 목록이 있을 때
            <ul className='flex h-[850px] flex-col gap-[10px] overflow-y-auto p-[10px]'>
              {dummyRooms.map((room, index) => (
                <li
                  key={index}
                  onClick={() => handleChatClick(room)} // 클릭 시 채팅 선택
                  className='flex cursor-pointer flex-col gap-[10px] rounded-[5px] border border-white bg-white pl-[30px] pt-[10px] text-[20px] hover:border-[#A1DFFF]'
                >
                  <div className='flex items-center gap-[5px]'>
                    <img className='h-[30px] w-[30px] object-cover' src='/cat_image.png' alt='고양이 이미지' />
                    <div className='mt-[5px] text-[20px]'>{room.name}</div>
                  </div>
                  <div className=''>{room.msg}</div>
                </li>
              ))}
            {/* 빈 div로 스크롤 하단 유지 */}
            <ScrollToBottom chatHistory={dummyRooms} />
          </ul>
          )}
          
        </div>
      </div>
    </div>
  );
};

export default ChatCheck;
