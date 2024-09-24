// import data from '@emoji-mart/data';
// import Picker from '@emoji-mart/react';
// import React, { KeyboardEvent, useEffect, useRef, useState } from 'react';
// import { baseApi } from '../apis/base-api';

// import { activateSimulation, askSimulation, fetchSimulationHistory, fetchIdSession } from '../apis/AICoach-api';

// interface ChatSession {
//   id: number;
//   topic: string;
//   createdAt: string;
// }

// interface Message {
//   id: number;
//   sessionId: number;
//   message: string;
//   sender: string;
//   createdAt: string;
// }

// const AICoach: React.FC = () => {
//   const [message, setMessage] = useState<string>(''); // 입력된 메시지를 저장하기 위한 상태 변수
//   const [nickname, setNickname] = useState<string>(''); // 사용자의 닉네임을 저장하기 위한 상태 변수
//   // const [hashTag, setHashTag] = useState(''); // 해시태그 상태 변수

//   const endOfMessageRef = useRef<HTMLDivElement>(null); // 채팅 목록의 마지막 요소를 참조하기 위한 ref
//   const messageRefs = useRef<Array<HTMLLIElement | null>>([]); // 각 메시지를 참조하기 위한 ref 배열
//   const [showEmojiPicker, setShowEmojiPicker] = useState(false); // 이모지 선택장 표시여부 저장하는 상태 변수

//   const [sessions, setSessions] = useState<ChatSession[]>([]); // 현재 세션 목록을 저장하기 위한 상태 변수
//   const [currentSessionId, setCurrentSessionId] = useState<number | null>(null); // 현재 활성화된 세션의 ID
//   const [chatHistory, setChatHistory] = useState<Message[]>([]); // 채팅 기록을 저장하기 위한 상태 변수
//   const [newMessage, setNewMessage] = useState<string>(''); // 새로 입력된 메시지를 저장하기 위한 상태 변수
//   const [isNewChat, setIsNewChat] = useState<boolean>(false); // 새로 채팅 여부를 저장하는 상태 변수

//   // AI 코칭 탭 클릭 시 기존 세션 목록 가져오기
//   useEffect(() => {
//     const fetchChatSessions = async () => {
//       try {
//         const sessionResponse = await baseApi.get('/simulation');
//         setSessions(sessionResponse.data.history); // 응답에서 세션 목록을 추출하여 상태 업데이트
//       } catch (error) {
//         console.error('채팅 세션을 불러오는데 실패했습니다.', error);
//       }
//     };

//     fetchChatSessions();
//   }, []);

//   // 새로운 세션 시작 or 세션 이어받기 ok 새 채팅 버튼 클릭시 event
//   const newChat = async (isNew: boolean) => {
//     try {
//       const response = await activateSimulation(isNew); // isNew 전달 api로 던짐
//       setCurrentSessionId(response.data.sessionId); // response에서 sessionId 추출
//       if (!isNew) setChatHistory([]); // 새로운 세션일 경우 메시지 초기화
//       await loadMessages(response.data.sessionId); // 메시지 불러오기
//     } catch (error) {
//       console.log('Failed to activate simulation:', error);
//     }
//   };

//   const receivedFetchId = async (sessionId: number) => {
//     try {
//       const response = await fetchIdSession();
//       setChatHistory(response.data.message);
//     } catch (error) {
//       console.error('Failed to received Id:', error);
//     }
//   }

//   // 특정 세션의 메시지 불러오기 ok
//   const loadMessages = async (sessionId: number) => {
//     try {
//       const response = await fetchSimulationHistory(); // sessionId 전달 sessionId
//       if (Array.isArray(response.data.message)) {
//         setChatHistory(response.data.message);
//         receivedFetchId(response.data.message); // 추가함
//         } else {
//             console.error('Expected array for messages, but got:', response.data.message);
//             setChatHistory([]); // 빈 배열로 설정

//         }
//     } catch (error) {
//         console.error('Failed to load messages:', error);
//     }
//       };

//   // 질문 전송 후 AI 응답 받기 ok 버튼에 event, 채팅목록에 event
//   const sendAIMessage = async () => {
//     if (newMessage.trim() === '' || currentSessionId === null) return;

//     try {
//       const response = await askSimulation(); // newMessage와 sessionId 전달 newMessage, currentSessionId
//       // 새로운 메시지를 Message 타입으로 설정
//       const userMessage: Message = {
//         id: Date.now(),
//         sessionId: currentSessionId,
//         message: newMessage,
//         sender: 'user',
//         createdAt: new Date().toISOString(),
//       };

//       const aiMessage: Message = {
//         id: Date.now() + 1,
//         sessionId: currentSessionId,
//         message: response.data.answer,
//         sender: 'ai',
//         createdAt: new Date().toISOString(),
//       };

//       setChatHistory((prev) => [
//         ...prev,
//         userMessage, // userMessage 추가
//         aiMessage, // aiMessage 추가
//       ]);
//       setNewMessage('');
//     } catch (error) {
//       console.error('메시지를 전송하는데 실패하였습니다.', error);
//     }
//   };

//   // // 새 채팅 버튼 클릭시 채팅 기록을 초기화
//   // const handleDeleteChat = () => {
//   //     console.log('deleteMessage:')
//   //     setChatHistory([])
//   // }

//   // 선택한 이모티콘을 메시지에 추가
//   const handleEmojiSelect = (emoji: any) => {
//     setMessage((prevMessage) => prevMessage + emoji.native);
//     setShowEmojiPicker(false); // 이모지 선택후 창 닫기
//   };

//   // 메시지의 index로 스크롤 이동하는 함수
//   const scrollToMessage = (index: number) => {
//     const targetElement = messageRefs.current[index]; // 채팅 메시지 참조
//     if (targetElement) {
//       targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' }); // 채팅기록 부분 클릭시 해당 위치로 이동
//     }
//   };

//   // 채팅 목록이 업데이트될 때 스크롤을 하단으로 이동 해당 높이를 넘어설 경우 자동으로 스크롤이 생기고, 스크롤이 자동 하단으로 이동
//   useEffect(() => {
//     endOfMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [chatHistory]);

//   // 전송 버튼 클릭시 메시지가 전송되는 함수
//   const handleSend = () => {
//     if (nickname && message) {
//       const time = new Date().toLocaleTimeString();
//       console.log('Sending message:', { name: nickname, msg: message, time });

//       const newMessage: Message = {
//         // Message 타입으로 변경
//         id: Date.now(), // 유일한 ID 생성
//         sessionId: currentSessionId ?? 0, // 세션 ID (null일 경우 기본값 설정)
//         message: message, // 실제 메시지 내용
//         sender: nickname, // 보낸 사람
//         createdAt: new Date().toISOString(), // 생성 시간
//       };

//       setChatHistory((prevChatHistory) => [...prevChatHistory, newMessage]); // Message 타입에 맞게 추가
//       setMessage(''); // 메시지를 빈 내용으로 업데이트
//     } else {
//       console.log('Nickname or message is empty');
//     }
//   };

//   // input에서 enter 키를 치면 자동으로 메시지가 전송이 되도록 하는 함수 이벤트
//   const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === 'Enter') {
//       handleSend();
//     }
//   };

//   // 시간을 나타내주는 함수로서 사용할 경우 이 부분을 이용하면 됨 미사용일 경우 굳이 할 필요 없음
//   // const formatTime = (time: string) => {
//   //   // 시간을 오전/오후 포멧으로 변환
//   //   const [hour, minute] = time.split(':').map(Number);
//   //   const period = hour >= 12 ? 'PM' : 'AM';
//   //   const formattedHour = hour % 12 || 12; // 12시간제로 변환
//   //   return `${formattedHour}:${minute < 10 ? `0${minute}` : minute} ${period}`;
//   // };

//   return (
//     <div className='chatRoom flex flex-col items-center'>
//       <div className='mt-[140px] flex flex-col items-center'>
//         <div className='text-[28px] font-bold text-black'>AI 코치</div>
//         <div className='mt-[10px] w-[100px] border-b-2 border-[#8D8B67]'></div>
//       </div>

//       <div className='mt-[90px] flex w-[1300px] justify-center'>
//         <div className='flex gap-[30px]'>
//           <div className='Left-list h-[1000px] w-[300px] rounded-[30px] border border-[#8D8B67] bg-[#FBFAEC]'>
//             <div className='flex h-[100px] w-[300px] flex-col items-center justify-center rounded-t-[30px] border border-b-[#8D8B67]'>
//               <p className='text-[25px]'>1:1 채팅 목록</p>
//             </div>
//             <div className='h-[calc(100%_-_100px)] p-[15px]'>
//               <div className='h-full w-full'>
//                 <ul className='flex h-[850px] flex-col gap-[10px] overflow-y-auto p-[10px]'>
//                       {chatHistory && chatHistory.length > 0 ? (
//                         chatHistory.map((item, index) => (
//                           <li
//                             key={index}
//                             onClick={() => scrollToMessage(index)}
//                             className='flex cursor-pointer flex-col gap-[10px] rounded-[5px] border border-white bg-white pl-[30px] pt-[10px] text-[20px] hover:border-black'
//                           >
//                             <div className='flex items-center gap-[5px]'>
//                               <img className='h-[30px] w-[30px] object-cover' src='/cat_image.png' alt='고양이 이미지' />
//                               <div className='mt-[5px] text-[20px]'>{item.sender}</div>
//                             </div>
//                             <div className=''>{item.message}</div>
//                           </li>
//                         ))
//                       ) : (
//                         <div>메시지가 없습니다.</div>  // chatHistory가 비어 있을 때 표시할 메시지
//                       )}
//                   {/* 빈 div로 스크롤 하단 유지 */}
//                   <div ref={endOfMessageRef} />
//                 </ul>
//               </div>
//             </div>
//           </div>

//           <div className='ID-container h-[1000px] w-[970px] rounded-[30px] border border-[#8D8B67]'>
//             <div className='flex h-[100px] w-full items-center justify-between rounded-t-[30px] border bg-[#FBFAEC] pl-[30px] pr-[20px]'>
//               <div className='flex text-[25px] font-bold'>
//                 <div className='mr-[5px]'>설기</div>
//                 <input type='text' value={nickname} onChange={(e) => setNickname(e.target.value)} className='bg-[#EEF9FF] text-[20px] outline-none' placeholder='Enter your nickname' />
//                 {/* <div>#IT #AI 코치</div> */}
//               </div>
//               <button onClick={() => newChat(true)} className='h-[60px] w-[140px] rounded-xl bg-[#C7C4A7] text-[33px] text-[#626146] hover:bg-[#626146] hover:text-white'>
//                 새 채팅
//               </button>
//             </div>

//             {/* 메시지 표시 영역 */}
//             <div className='Display-container flex h-[800px] w-full border-b-[1px] border-[#59573D] bg-white'>
//               <ul className='Chatting-list flex h-full w-full flex-col gap-[10px] overflow-y-auto p-[20px]'>
//                 {chatHistory.map((item, index) => (
//                   <li
//                     key={index}
//                     ref={(el) => (messageRefs.current[index] = el)} // 각 메시지를 참조하기 위해 ref 저장
//                     className={`flex items-start gap-[10px] ${nickname === item.sender ? 'flex-row-reverse' : ''}`}
//                   >
//                     {/* <img className='h-[100px] w-[100px] object-cover' src='/cat_image.png' alt='고양이 이미지' /> */}
//                     <div className='flex max-w-[80%] flex-col justify-end gap-[5px]'>
//                       <div className={`flex ${nickname === item.sender ? 'justify-end' : ''}`}>
//                         <div className='text-[20px] font-bold'>{item.message}</div>
//                       </div>
//                       <div className='flex items-start gap-[5px]'>
//                         <span className={`max-w-[300px] break-words rounded-[10px] p-3 text-[20px] shadow-xl ${nickname === item.sender ? 'bg-[#FFEABA]' : 'bg-[#FBFAEC]'}`}>{item.message}</span>
//                         {/* <span className='ml-2 text-xs text-gray-500'>{item.time}</span> */}
//                       </div>
//                     </div>
//                   </li>
//                 ))}
//                 {/* 빈 div로 스크롤 하단 유지 */}
//                 <div ref={endOfMessageRef} />
//               </ul>
//               {/* 질문 표시 */}
//               {/* {question && <div className='mt-4 text-xl font-bold'>{question}</div>} */}
//               {/* <div className='absolute bottom-[-300px] flex gap-[15px] pl-[30px] text-[20px]'>
//                 <button onClick={() => handleGetQuestion} className='h-[50px] w-[80px] rounded-[10px] bg-[#FFB896]'>
//                   면접
//                 </button>
//                 <button onClick={() => handleGetQuestion} className='h-[50px] w-[120px] rounded-[10px] bg-[#FFB896]'>
//                   시나리오
//                 </button>
//                 <button onClick={() => handleGetQuestion} className='h-[50px] w-[120px] rounded-[10px] bg-[#FFB896]'>
//                   문제해결
//                 </button>
//                 <button onClick={() => handleGetQuestion} className='h-[50px] w-[120px] rounded-[10px] bg-[#FFB896]'>
//                   상식
//                 </button>
//                 <button onClick={() => handleGetQuestion} className='h-[50px] w-[80px] rounded-[10px] bg-[#FFEABA]'>
//                   랜덤
//                 </button>
//               </div> */}
//             </div>

//             {/* 메시지 입력창 */}
//             <div className='Input-container relative flex h-[100px] w-[970px] items-center justify-center gap-[20px] rounded-b-[30px] border-b'>
//               <div className='relative flex w-[100px] items-center justify-center'>
//                 <img onClick={() => setShowEmojiPicker(!showEmojiPicker)} className='flex h-[45px] w-[45px] cursor-pointer items-center justify-center object-cover' src='/smile.png' alt='이모티콘' />
//                 {showEmojiPicker && (
//                   <div className='absolute left-[10px] top-[-450px]'>
//                     <Picker data={data} onEmojiSelect={handleEmojiSelect} /> {/* 이모티콘 선택기 */}
//                   </div>
//                 )}
//               </div>
//               <div className='flex h-[80px] w-[650px] items-center justify-center'>
//                 <input
//                   className='h-full w-full text-[20px] text-[#59573D] outline-none'
//                   placeholder='Type message...'
//                   value={message}
//                   onChange={(e) => setMessage(e.target.value)}
//                   onKeyPress={handleKeyPress}
//                 />
//               </div>
//               <div onClick={sendAIMessage} className='flex h-[60px] w-[130px] cursor-pointer items-center justify-center rounded-[10px] bg-[#FBFAEC] hover:bg-[#8D8B67]'>
//                 <button className='text-[28px] text-[#626146]'>전송</button>
//               </div>
//             </div>
//             <div className='mt-[30px] flex text-[20px]'>
//               <div>
//                 '<span className='text-[25px] font-bold'>면접</span>'을 검색해보세요 &nbsp; &nbsp;
//               </div>
//               <div>
//                 '<span className='text-[25px] font-bold'>상식</span>'을 검색해보세요 &nbsp; &nbsp;
//               </div>
//               <div>
//                 '<span className='text-[25px] font-bold'>랜덤질문</span>'을 검색해보세요
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AICoach;
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import React, { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { activateSimulation, askSimulation, fetchIdSession, fetchSimulationHistory } from '../apis/AICoach-api';
import './AICoach.css';

interface ChatSession {
  id: number;
  topic: string;
  createdAt: string;
}

interface Message {
  id: number;
  sessionId: number;
  message: string;
  sender: string;
  createdAt: string;
  isTyping?: boolean;
}

const AICoach: React.FC = () => {
  const [message, setMessage] = useState<string>(''); // 입력된 메시지를 저장하기 위한 상태 변수
  const endOfMessageRef = useRef<HTMLDivElement>(null);
  const messageRefs = useRef<Array<HTMLLIElement | null>>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>([]); // 세션 리스트 저장 상태
  const [currentSessionId, setCurrentSessionId] = useState<number | null>(null); // 현재 활성화된 세션 ID
  const [chatHistory, setChatHistory] = useState<Message[]>([]); // 채팅 기록 상태

  // AI 코칭 탭 클릭 시 기존 세션 목록 불러오기
  useEffect(() => {
    const fetchChatSessions = async () => {
      try {
        const sessionResponse = await fetchSimulationHistory();
        setSessions(sessionResponse.history); // 응답에서 세션 목록을 추출하여 상태 업데이트

        // 새로고침 시 가장 최근 세션 불러오기
        if (sessionResponse.history.length > 0) {
          const lastSession = sessionResponse.history[0];
          await loadMessages(lastSession.id);
          setCurrentSessionId(lastSession.id);
        }
      } catch (error) {
        console.error('채팅 세션을 불러오는데 실패했습니다.', error);
      }
    };

    fetchChatSessions();
  }, []);

  // 세션 클릭 시 해당 세션의 메시지 불러오기
  const loadMessages = async (sessionId: number) => {
    try {
      const response = await fetchIdSession(sessionId);
      setChatHistory(response.messages);
      setCurrentSessionId(sessionId); // 현재 세션 ID 업데이트
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  // 새로운 세션 시작 or 세션 이어받기
  const newChat = async (isNew: boolean) => {
    try {
      const response = await activateSimulation(isNew);
      setCurrentSessionId(response.sessionId);
      if (isNew) setChatHistory([]);
      await loadMessages(response.sessionId);
    } catch (error) {
      console.log('Failed to activate simulation:', error);
    }
  };

  // 질문 전송 후 AI 응답 받기
  const sendAIMessage = async () => {
    if (message.trim() === '' || currentSessionId === null) return;

    // 유저 메시지를 먼저 화면에 표시
    const userMessage: Message = {
      id: Date.now(),
      sessionId: currentSessionId,
      message: message,
      sender: 'user',
      createdAt: new Date().toISOString(),
    };

    setChatHistory((prev) => [...prev, userMessage]); // UI에 사용자 메시지를 먼저 표시
    setMessage(''); // 메시지 초기화

    // AI의 "typing..." 메시지를 추가
    const typingMessage: Message = {
      id: Date.now() + 1, // 고유 ID 설정
      sessionId: currentSessionId,
      message: 'typing...', // 타이핑 메시지
      sender: 'ai',
      createdAt: new Date().toISOString(),
      isTyping: true, // 추가 필드로 타이핑 여부 표시
    };

    setChatHistory((prev) => [...prev, typingMessage]); // 타이핑 메시지 추가
    endOfMessageRef.current?.scrollIntoView({ behavior: 'smooth' });

    try {
      // AI 응답을 서버로부터 받기
      const response = await askSimulation(userMessage.message, currentSessionId);

      // AI 응답으로 됨
      const aiMessage: Message = {
        id: Date.now() + 2,
        sessionId: currentSessionId,
        message: response.answer,
        sender: 'ai',
        createdAt: new Date().toISOString(),
      };

      // AI 응답을 실시간으로 화면에 바로 표시
      setChatHistory((prev) => {
        const updatedHistory = prev.map((msg) => (msg.id === typingMessage.id ? aiMessage : msg)); // AI typing... 에서 AI답으로 변경
        return updatedHistory; // 타이핑 메시지를 AI 응답으로 변경
      });
      endOfMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      console.error('메시지를 전송하는데 실패하였습니다.', error);
    }
  };

  // 이모티콘 선택
  const handleEmojiSelect = (emoji: any) => {
    setMessage((prevMessage) => prevMessage + emoji.native);
    setShowEmojiPicker(false);
  };

  const scrollToMessage = (index: number) => {
    const targetElement = messageRefs.current[index];
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // 채팅 목록이 업데이트될 때 자동 스크롤
  useEffect(() => {
    endOfMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // 전송 버튼 클릭 시 메시지 전송
  const handleSend = () => {
    if (message.trim() !== '') {
      sendAIMessage();
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  return (
    <div className='chatRoom flex flex-col items-center'>
      <div className='mt-[140px] flex flex-col items-center'>
        <div className='text-[28px] font-bold text-black'>AI 코치</div>
        <div className='mt-[10px] w-[100px] border-b-2 border-[#8D8B67]'></div>
      </div>

      <div className='mt-[90px] flex text-[20px]'>
        <div>
          '<span className='text-[25px] font-bold'>면접</span>'을 검색해보세요 &nbsp; &nbsp;
        </div>
        <div>
          '<span className='text-[25px] font-bold'>상식</span>'을 검색해보세요 &nbsp; &nbsp;
        </div>
        <div>
          '<span className='text-[25px] font-bold'>랜덤질문</span>'을 검색해보세요
        </div>
      </div>

      <div className='mt-[30px] flex w-[1300px] justify-center'>
        <div className='flex gap-[30px]'>
          <div className='Left-list h-[1000px] w-[300px] rounded-[30px] border border-[#8D8B67] bg-[#FBFAEC]'>
            <div className='flex h-[100px] w-[300px] flex-col items-center justify-center rounded-t-[30px] border border-b-[#8D8B67]'>
              <p className='text-[25px]'>1:1 채팅 목록</p>
            </div>
            <div className='h-[calc(100%_-_100px)] p-[15px]'>
              <div className='h-full w-full'>
                <ul className='flex h-[850px] flex-col gap-[10px] overflow-y-auto p-[10px]'>
                  {sessions.map((session) => (
                    <li
                      key={session.id}
                      onClick={() => loadMessages(session.id)} // 클릭 시 해당 세션의 메시지 불러오기
                      className='flex cursor-pointer flex-col gap-[10px] rounded-[5px] border border-white bg-white pl-[30px] pt-[10px] text-[20px] hover:border-black'
                    >
                      <div className='flex items-center gap-[5px]'>
                        <div className='mt-[5px] text-[20px] font-bold'>{session.topic}</div>
                      </div>
                      <div className=''>{formatDateTime(session.createdAt)}</div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className='ID-container h-[1000px] w-[970px] rounded-[30px] border border-[#8D8B67]'>
            <div className='flex h-[100px] w-full items-center justify-between rounded-t-[30px] border bg-[#FBFAEC] pl-[30px] pr-[20px]'>
              <div className='flex text-[25px] font-bold'>
                <div className='mr-[5px]'>설기</div>
              </div>
              <button onClick={() => newChat(true)} className='h-[60px] w-[140px] rounded-xl bg-[#C7C4A7] text-[33px] text-[#626146] hover:bg-[#626146] hover:text-white'>
                새 채팅
              </button>
            </div>
            <div className='Display-container flex h-[800px] w-full border-b-[1px] border-[#59573D] bg-white'>
              <ul className='Chatting-list flex h-full w-full flex-col gap-[10px] overflow-y-auto p-[20px]'>
                {chatHistory.map((item, index) => (
                  <li
                    key={index}
                    ref={(el) => (messageRefs.current[index] = el)} // 각 메시지를 참조하기 위해 ref 저장
                    className={`flex items-start gap-[10px] ${item.sender === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    {item.sender === 'ai' && <img src='/AI_image.png' className='AI-image-class' />}
                    <div className='flex max-w-[80%] flex-col justify-end gap-[5px]'>
                      <div className={`flex ${item.sender === 'user' ? 'justify-end' : ''}`}>
                        <div className='text-[20px] font-bold'>{item.sender === 'user' ? '나' : 'AI코치 설기'}</div> {/* 유저와 AI 구분 */}
                      </div>
                      <div className='flex items-start gap-[5px]'>
                        <span className={`max-w-[300px] break-words rounded-[10px] p-3 text-[20px] shadow-xl ${item.sender === 'user' ? 'bg-[#FFEABA]' : 'bg-[#FBFAEC]'}`}>
                          {item.message}
                          {item.isTyping && <div className='loader' />}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
                {/* 빈 div로 스크롤 하단 유지 */}
                <div ref={endOfMessageRef} />
              </ul>
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
