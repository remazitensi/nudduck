import data from '@emoji-mart/data'; // emoji-mart 스타일 npm install @emoji-mart/react
import Picker from '@emoji-mart/react';
import { KeyboardEvent, useState } from 'react';
import { sendMessage } from '../../apis/chatRoom-api';
import socket from '../../pages/socket';
import { SendMessageData } from '../../types/chat-type';

interface SendButtonProps {
  onClick: () => void; // onClick prop 추가
  roomId: string;
  loggedInUserId: number;
  loggedInUserNickname: string;
  // message: string;
  // handleSendMessage: (message: { name: string; msg: string; time: string }) => void; // 부모로부터 전달받는 함수 더미
}

const SendButton: React.FC<SendButtonProps> = ({ loggedInUserId, loggedInUserNickname, roomId, onClick }) => {
  // type 지정 메시지 존송 시 요청 데이터
  const [sendData, setSendData] = useState<SendMessageData | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false); // 이모티콘 선택기 표시 여부
  const [message, setMessage] = useState<string>(''); // 사용자가 입력한 메시지 상태
  const [chatHistory, setChatHistory] = useState<Array<{ name: string; msg: string; time: string }> | null>(null); // 채팅 메시지를 저장하는 배열
  // const [loggedInUserId, setLoggedInUserId] = useState<number>(0); // 로그인한 사용자 ID 초기화
  // const [loggedInUserNickname, setLoggedInUserNickname] = useState<string>(''); // 로그인한 사용자 닉네임 초기화

  // 메시지 전송 함수
  const sendChatMessage = async () => {
    // const loggedInUserId = 1;  // 가상의 사용자 ID
    // const loggedInUserNickname = 'hihia';  // 가상의 사용자 닉네임
    // const roomId = "dummyRoomId";  // 가상의 방 ID (실제 API 호출로 받은 값이어야 함)

    console.log('sendChatMessage 함수 호출됨'); // 글을 쓰게 되면 함수 호출이 된다
    console.log('Room Id 확인:', roomId);

    if (!message.trim()) {
      console.error('Message cannot be empty'); // message가 빈 문자열이거나, 공백일 경우 오류 출력
      return;
    }

    // console.log("Sending message to Room ID:", roomId);

    if (!roomId || roomId.trim() === '') {
      // roomId가 없을 때 오류 메시지를 출력하도록 수정
      console.error('Room is not defined');
      return;
    }

    // if (!roomId) { // roomId가 없는 경우에 오류 출력
    //   console.error('Room ID is not defined');
    //   return; // roomId가 없을 경우 메시지 전송 중단
    // }

    try {
      // 메시지 전송
      console.log('Sending message to room:', 'with message:', message); // 메시지 전송에 대한 로그 출력
      console.log('??', roomId);
      // 실제로 메시지를 전송하는 API 호출
      await sendMessage(loggedInUserId, roomId, message); // 세 개의 인자를 개별적으로 전달

      // socket을 사용해서 서버에 메시지를 전송
      socket.emit('createRoom', { chatroomName: 'Room 1', participants: ['user1', 'user2'] });
      setMessage(''); // 메시지 입력란 초기화

      // 채팅 기록 업데이트 (기존 기록에 새 메시지를 추가)
      setChatHistory((prev) => [...prev, { name: roomId, msg: message, time: new Date().toLocaleTimeString() }]);
    } catch (error) {
      console.log('Failed to sendMessage:', error);
    }
  };

  const handleEmojiSelect = (emoji: any) => {
    setMessage((prevMessage) => prevMessage + emoji.native); // 선택한 이모티콘을 메시지에 추가
    setShowEmojiPicker(false); // 이모지 선택후 창 닫기
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendChatMessage(); // Enter 키로 메시지 전송
    }
  };

  return (
    <div className='Input-container flex h-[100px] w-[970px] items-center justify-center gap-[20px] rounded-b-[30px] border-b'>
      <div className='relative flex w-[100px] items-center justify-center'>
        <img onClick={() => setShowEmojiPicker(!showEmojiPicker)} className='flex h-[45px] w-[45px] cursor-pointer items-center justify-center object-cover' src='/smile.png' alt='이모티콘' />
        {showEmojiPicker && (
          <div className='absolute left-[10px] top-[-450px]'>
            <Picker data={data} onEmojiSelect={handleEmojiSelect} /> {/* 이모티콘 선택기 */}
          </div>
        )}
      </div>
      <div className='flex h-[80px] w-[650px] items-center justify-center'>
        <input
          className='h-full w-full text-[20px] text-[#59573D] outline-none'
          placeholder='Type message...'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
        />
      </div>
      <div className='flex h-[60px] w-[130px] cursor-pointer items-center justify-center rounded-[10px] bg-[#EEF9FF] hover:bg-[#A1DFFF]'>
        <button
          onClick={() => {
            onClick();
            sendChatMessage();
          }}
          className='text-[28px] text-[#626146]'
        >
          전송
        </button>
      </div>
    </div>
  );
};

export default SendButton;
