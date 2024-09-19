import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import React, { KeyboardEvent, useEffect, useRef, useState } from 'react';

import { deleteAIChat, getAIChat, getAIQuestion } from '../apis/AICoach-api';

const AICoach: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const [nickname, setNickname] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<Array<{ name: string; msg: string }>>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [hashTag, setHashTag] = useState('');
  const [question, setQuestion] = useState<string>(''); // 받아온 질문 저장
  const endOfMessageRef = useRef<HTMLDivElement>(null); // 채팅 목록의 마지막 요소를 참조하기 위한 ref
  const messageRefs = useRef<Array<HTMLLIElement | null>>([]); // 각 메시지를 참조하기 위한 ref 배열

  const [category, setCategory] = useState<string>(''); // 기본 카테고리

  // api 연결 확인을 위한 getAIChat 호출
  const handleGetChat = async () => {
    try {
      const data = await getAIChat(); // API에서 데이터를 받아옴
      console.log('AI Chat data:', data);
      setMessage(data); // 받아온 데이터를 메시지 상태로 저장
    } catch (error) {
      console.error('Failed to fetch chat data', error);
    }
  };

  // 더미 데이터를 가져오는 getAIQuestion 호출
  const handleGetQuestion = async () => {
    try {
      const data = await getAIQuestion(category); // 선택된 카테고리로 질문 데이터 받기
      console.log('Question data:', data);
      setMessage(data.question); // 받아온 질문 데이터를 메시지로 출력
    } catch (error) {
      console.error('Failed to fetch qeustion', error);
    }
  };

  const newChat = async () => {
    try {
      await deleteAIChat(); // api 호출하여 채팅 데이터 삭제
      console.log('delete data');
      setChatHistory([]); // 채팅 기록 상태 초기화
    } catch (error) {
      console.log('Failed to delete data', error);
    }
  };

  // // 새 채팅 버튼 클릭시 채팅 기록을 초기화
  // const handleDeleteChat = () => {
  //     console.log('deleteMessage:')
  //     setChatHistory([])
  // }

  // 선택한 이모티콘을 메시지에 추가
  const handleEmojiSelect = (emoji: any) => {
    setMessage((prevMessage) => prevMessage + emoji.native);
    setShowEmojiPicker(false); // 이모지 선택후 창 닫기
  };

  // 메시지의 index로 스크롤 이동하는 함수
  const scrollToMessage = (index: number) => {
    const targetElement = messageRefs.current[index]; // 채팅 메시지 참조
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' }); // 채팅기록 부분 클릭시 해당 위치로 이동
    }
  };

  // 채팅 목록이 업데이트될 때 스크롤을 하단으로 이동 해당 높이를 넘어설 경우 자동으로 스크롤이 생기고, 스크롤이 자동 하단으로 이동
  useEffect(() => {
    endOfMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // 전송 버튼 클릭시 메시지가 전송되는 함수
  const handleSend = () => {
    if (nickname && message) {
      // 닉네임과 메시지가 없으면 전송이 안된다 nickname 헤더에서 지우면 작동 유무 확인 등
      // 메시지 전송
      const time = new Date().toLocaleTimeString();
      console.log('Sending message:', { name: nickname, msg: message, time }); // console로 전송할 데이터확인
      // Socket.emit('chatting', { name: nickname, msg: message, time }); // 메시지 보내기 socket을 쓸게 아니라서 닉네임, 메시지, 시간등을 보낸다는 걸 나타냄 예시일뿐 사용하지 않음
      const newMessage = { name: nickname, msg: message }; // newMessage정의
      setChatHistory((prevChatHistory) => [...prevChatHistory, newMessage]);
      setMessage(''); // 메시지를 보내게 되면 메시지를 빈 내용으로 업데이트
    } else {
      console.log('Nickname or message is empty'); // 만약 에러가 발생 즉 메시지를 보내지 못할경우 콘솔에 저 내용이 찍힘
    }
  };

  // input에서 enter 키를 치면 자동으로 메시지가 전송이 되도록 하는 함수 이벤트
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  // 시간을 나타내주는 함수로서 사용할 경우 이 부분을 이용하면 됨 미사용일 경우 굳이 할 필요 없음
  const formatTime = (time: string) => {
    // 시간을 오전/오후 포멧으로 변환
    const [hour, minute] = time.split(':').map(Number);
    const period = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12; // 12시간제로 변환
    return `${formattedHour}:${minute < 10 ? `0${minute}` : minute} ${period}`;
  };

  // 질문을 받아오는 함수
  // const fetchQuestion = async (category: string) => {
  //     try {
  //         const response = await fetch(`/api/questions?category=${category}`); // 템플릿 리터럴 사용
  //         const data = await response.json();
  //         setQuestion(data.question); // 받아온 질문을 저장
  //     } catch (error) {
  //         console.log('Error fetching question:', error);
  //     }
  // };

  // const fetchQuestion = async (category: string) => {
  //     try {
  //         const response = await fetch(`/api/questions?category=${category}`);
  //         const text = await response.text(); // 텍스트 형식으로 응답을 읽음
  //         console.log('Response:', text); // 응답 내용을 콘솔에 출력
  //         const data = JSON.parse(text); // JSON으로 파싱
  //         setQuestion(data.question);
  //     } catch (error) {
  //         console.log('Error fetching question:', error);
  //     }
  // };

  // const fetchQuestion = async (category: string) => {
  //     try {
  //         const response = await fetch(`/api/questions?category=${category}`);

  //         // 응답 상태가 200~299 범위인지 확인합니다.
  //         if (response.ok) {
  //             const data = await response.json(); // JSON으로 직접 파싱
  //             console.log('Response:', data); // 응답 내용을 콘솔에 출력
  //             setQuestion(data.question);
  //         } else {
  //             console.error('Error fetching question:', response.statusText);
  //         }
  //     } catch (error) {
  //         console.log('Error fetching question:', error);
  //     }
  // };

  return (
    <div className='chatRoom flex flex-col items-center'>
      <div className='mt-[140px] flex flex-col items-center'>
        <div className='text-[28px] font-bold text-black'>AI 코치</div>
        <div className='mt-[10px] w-[100px] border-b-2 border-[#8D8B67]'></div>
      </div>

      <div className='mt-[90px] flex w-[1300px] justify-center'>
        <div className='flex gap-[30px]'>
          <div className='Left-list h-[1000px] w-[300px] rounded-[30px] border border-[#8D8B67] bg-[#FBFAEC]'>
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
                      className='flex cursor-pointer flex-col gap-[10px] rounded-[5px] border border-white bg-white pl-[30px] pt-[10px] text-[20px] hover:border-black'
                    >
                      <div className='flex items-center gap-[5px]'>
                        <img className='h-[30px] w-[30px] object-cover' src='/cat_image.png' alt='고양이 이미지' />
                        <div className='mt-[5px] text-[20px]'>{item.name}</div>
                      </div>
                      <div className=''>{item.msg}</div>
                    </li>
                  ))}
                  {/* 빈 div로 스크롤 하단 유지 */}
                  <div ref={endOfMessageRef} />
                </ul>
              </div>
            </div>
          </div>

          <div className='ID-container h-[1000px] w-[970px] rounded-[30px] border border-[#8D8B67]'>
            <div className='flex h-[100px] w-full items-center justify-between rounded-t-[30px] border bg-[#FBFAEC] pl-[30px] pr-[20px]'>
              <div className='flex text-[25px] font-bold'>
                <div className='mr-[5px]'>설기</div>
                <input type='text' value={nickname} onChange={(e) => setNickname(e.target.value)} className='bg-[#EEF9FF] text-[20px] outline-none' placeholder='Enter your nickname' />
                <div>#IT #AI 코치</div>
              </div>
              <button onClick={newChat} className='h-[60px] w-[140px] rounded-xl bg-[#C7C4A7] text-[33px] text-[#626146] hover:bg-[#626146] hover:text-white'>
                새 채팅
              </button>
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
                    {/* <img className='h-[100px] w-[100px] object-cover' src='/cat_image.png' alt='고양이 이미지' /> */}
                    <div className='flex max-w-[80%] flex-col justify-end gap-[5px]'>
                      <div className={`flex ${nickname === item.name ? 'justify-end' : ''}`}>
                        <div className='text-[20px] font-bold'>{item.name}</div>
                      </div>
                      <div className='flex items-start gap-[5px]'>
                        <span className={`max-w-[300px] break-words rounded-[10px] p-3 text-[20px] shadow-xl ${nickname === item.name ? 'bg-[#FFEABA]' : 'bg-[#FBFAEC]'}`}>{item.msg}</span>
                        {/* <span className='ml-2 text-xs text-gray-500'>{item.time}</span> */}
                      </div>
                    </div>
                  </li>
                ))}
                {/* 빈 div로 스크롤 하단 유지 */}
                <div ref={endOfMessageRef} />
              </ul>
              {/* 질문 표시 */}
              {/* {question && <div className='mt-4 text-xl font-bold'>{question}</div>} */}
              <div className='absolute bottom-[-300px] flex gap-[15px] pl-[30px] text-[20px]'>
                <button onClick={() => handleGetQuestion} className='h-[50px] w-[80px] rounded-[10px] bg-[#FFB896]'>
                  면접
                </button>
                <button onClick={() => handleGetQuestion} className='h-[50px] w-[120px] rounded-[10px] bg-[#FFB896]'>
                  시나리오
                </button>
                <button onClick={() => handleGetQuestion} className='h-[50px] w-[120px] rounded-[10px] bg-[#FFB896]'>
                  문제해결
                </button>
                <button onClick={() => handleGetQuestion} className='h-[50px] w-[120px] rounded-[10px] bg-[#FFB896]'>
                  상식
                </button>
                <button onClick={() => handleGetQuestion} className='h-[50px] w-[80px] rounded-[10px] bg-[#FFEABA]'>
                  랜덤
                </button>
              </div>
            </div>

            {/* 메시지 입력창 */}
            <div className='Input-container relative flex h-[100px] w-[970px] items-center justify-center gap-[20px] rounded-b-[30px] border-b'>
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
              <div onClick={handleSend} className='flex h-[60px] w-[130px] cursor-pointer items-center justify-center rounded-[10px] bg-[#FBFAEC] hover:bg-[#8D8B67]'>
                <button className='text-[28px] text-[#626146]'>전송</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AICoach;
