import data from '@emoji-mart/data'; // emoji-mart 스타일 npm install @emoji-mart/react
import Picker from '@emoji-mart/react';
import React, { KeyboardEvent, useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

// 소켓 서버 주소 설정
const socket = io('http://localhost:7000'); // 서버 포트번호 7000으로 연결

const ChatRoom: React.FC = () => {
  const [message, setMessage] = useState<string>(''); // 사용자가 입력한 메시지 상태
  const [nickname, setNickName] = useState<string>(''); // 사용자 닉네임 상태
  const [chatHistory, setChatHistory] = useState<Array<{ name: string; msg: string; time: string }>>([]); // 채팅 메시지를 저장하는 배열
  const [showEmojiPicker, setShowEmojiPicker] = useState(false); // 이모티콘 선택기 표시 여부
  const [hashTag, setHashTag] = useState('');

  const handleEmojiSelect = (emoji: any) => {
    setMessage((prevMessage) => prevMessage + emoji.native); // 선택한 이모티콘을 메시지에 추가
    setShowEmojiPicker(false); // 이모지 선택후 창 닫기
  };

  // 채팅 목록의 마지막 요소를 참조하기 위한 ref
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  // 각 메시지를 참조하기 위한 ref 배열
  const messageRefs = useRef<Array<HTMLLIElement | null>>([]);

  // 메시지의 index로 스크롤 이동하느 ㄴ함수
  const scrollToMessage = (index: number) => {
    const targetElement = messageRefs.current[index]; // 해당 메시지 참조
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' }); // 해당 위치로 부드럽게 이동
    }
  };

  useEffect(() => {
    socket.on('chatting', (data: { name: string; msg: string; time: string }) => {
      // 채팅 기록 업데이트
      console.log('Received message:', data);
      setChatHistory((prev) => [...prev, { name: data.name, msg: data.msg, time: formatTime(data.time) }]);
    });

    return () => {
      socket.off('chatting');
    };
  }, []);

  useEffect(() => {
    // 채팅 목록이 업데이트될 때 스크롤을 하단으로 이동
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSend = () => {
    if (nickname && message) {
      // 메시지 전송
      const time = new Date().toLocaleTimeString();
      console.log('Sending message:', { name: nickname, msg: message, time }); // 전송할 데이터 확인
      socket.emit('chatting', { name: nickname, msg: message, time });
      setMessage('');
    } else {
      console.log('Nickname or message is empty'); // 닉네임 또는 메시지가 비어 있을 경우
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const formatTime = (time: string) => {
    // 시간을 오전/오후 포맷으로 변환
    const [hour, minute] = time.split(':').map(Number);
    const period = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12; // 12시간제로 변환
    return `${formattedHour}:${minute < 10 ? `0${minute}` : minute} ${period}`;
  };

  return (
    <div className='chatRoom flex flex-col items-center'>
      <div className='mt-[140px] flex flex-col items-center'>
        <div className='text-[28px] font-bold text-black'>커뮤니티</div>
        <div className='mt-[10px] w-[100px] border-b-2 border-[#8D8B67]'></div>
      </div>

      <div className='mt-[90px] flex w-[1300px] justify-center'>
        <div className='flex gap-[30px]'>
          <div className='Left-list h-[1000px] w-[300px] rounded-[30px] border border-[#8D8B67] bg-[#EEF9FF]'>
            <div className='flex h-[100px] w-[300px] flex-col items-center justify-center rounded-t-[30px] border border-b-[#8D8B67]'>
              <p className='text-[25px]'>1:1 채팅 목록</p>
            </div>
            <div className='h-[calc(100%_-_100px)] p-[15px]'>
              {/* Adjust height to fill the container */}
              <div className='h-full w-full'>
                <ul className='flex h-[850px] flex-col gap-[10px] overflow-y-auto p-[10px]'>
                  {chatHistory.map((item, index) => (
                    <li
                      key={index}
                      onClick={() => scrollToMessage(index)} // 클릭 시 해당 메시지로 이동
                      className='flex cursor-pointer flex-col gap-[10px] rounded-[5px] border border-white bg-white pl-[30px] pt-[10px] text-[20px] hover:border-[#A1DFFF]'
                    >
                      <div className='flex items-center gap-[5px]'>
                        <img className='h-[30px] w-[30px] object-cover' src='/cat_image.png' alt='고양이 이미지' />
                        <div className='mt-[5px] text-[20px]'>{item.name}</div>
                      </div>
                      <div className=''>{item.msg}</div>
                    </li>
                  ))}
                  {/* 빈 div로 스크롤 하단 유지 */}
                  <div ref={endOfMessagesRef} />
                </ul>
              </div>
            </div>
          </div>

          <div className='ID-container h-[1000px] w-[970px] rounded-[30px] border border-[#8D8B67]'>
            <div className='flex h-[100px] w-full items-center rounded-t-[30px] border bg-[#EEF9FF] pl-[30px]'>
              <input type='text' value={nickname} onChange={(e) => setNickName(e.target.value)} className='bg-[#EEF9FF] text-[20px] outline-none' placeholder='Enter your nickname' />
            </div>

            {/* 메시지 표시 영역 */}
            <div className='Display-container flex h-[800px] w-full border-b-[1px] border-[#59573D] bg-white'>
              <ul className='Chatting-list flex h-full w-full flex-col gap-[10px] overflow-y-auto p-[20px]'>
                {chatHistory.map((item, index) => (
                  <li
                    key={index}
                    ref={(el) => (messageRefs.current[index] = el)} // 각 메시지를 참조하기 위해 ref 저장
                    className={`flex items-start gap-[10px] ${nickname === item.name ? 'flex-row-reverse' : ''}`}
                  >
                    <img className='h-[100px] w-[100px] object-cover' src='/cat_image.png' alt='고양이 이미지' />
                    <div className='flex max-w-[80%] flex-col justify-end gap-[5px]'>
                      <div className={`flex ${nickname === item.name ? 'justify-end' : ''}`}>
                        <div className='text-[20px] font-bold'>{item.name}</div>
                      </div>
                      <div className='flex items-start gap-[5px]'>
                        <span className={`max-w-[300px] break-words rounded-[10px] p-3 text-[20px] shadow-xl ${nickname === item.name ? 'bg-[#EEF9FF]' : 'bg-[#FFEABA]'}`}>{item.msg}</span>
                        {/* <span className='ml-2 text-xs text-gray-500'>{item.time}</span> */}
                      </div>
                    </div>
                  </li>
                ))}
                {/* 빈 div로 스크롤 하단 유지 */}
                <div ref={endOfMessagesRef} />
              </ul>
            </div>

            {/* 메시지 입력창 */}
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
              <div onClick={handleSend} className='flex h-[60px] w-[130px] cursor-pointer items-center justify-center rounded-[10px] bg-[#EEF9FF] hover:bg-[#A1DFFF]'>
                <button className='text-[28px] text-[#626146]'>전송</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
