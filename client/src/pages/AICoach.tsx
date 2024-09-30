
// export default AICoach;
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import React, { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { activateSimulation, askSimulation, deleteSession, fetchIdSession, fetchSimulationHistory } from '../apis/AICoach-api'; 
import { changeDateWithFormat } from '../utils/change-date-with-format';
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
  const [isPageLoading, setIsPageLoading] = useState(true); // 페이지가 로드된 상태 확인을 위한 상태 변수
  const chatContainerRef = useRef<HTMLDivElement>(null); // 채팅 컨테이너 참조


   // 페이지가 로드될 때 스크롤을 최상단으로 이동
   useEffect(() => {
    window.scrollTo(0, 0); // 페이지 로드 시 스크롤을 최상단으로 이동
 
  }, []);

  // chatHistory가 업데이트될 때마다 채팅방 스크롤을 하단으로 이동
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight; // 채팅방 스크롤을 최하단으로 이동
    }
  }, [chatHistory]); // chatHistory가 변경될 때마다 실행

  // 세션 클릭 시 해당 세션의 메시지 불러오기
  const loadMessages = async (sessionId: number) => {
    try {
      const response = await fetchIdSession(sessionId);
      setChatHistory(response.messages);
      setCurrentSessionId(sessionId); // 현재 세션 ID 업데이트

      // 세션 클릭 시 채팅방 스크롤을 최하단으로 이동
      // endOfMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };


  // AI 코칭 탭 클릭 시 기존 세션 목록 불러오기
  // useEffect(() => {
  //   const fetchChatSessions = async () => {
  //     try {
  //       const sessionResponse = await fetchSimulationHistory();
  //       setSessions(sessionResponse.history); // 응답에서 세션 목록을 추출하여 상태 업데이트

  //       // 새로고침 시 가장 최근 세션 불러오기
  //       if (sessionResponse.history.length > 0) {
  //         const lastSession = sessionResponse.history[0];
  //         await loadMessages(lastSession.id);
  //         setCurrentSessionId(lastSession.id);
  //       }
  //     } catch (error) {
  //       console.error('채팅 세션을 불러오는데 실패했습니다.', error);
  //     }
  //   };

  //   fetchChatSessions();
  // }, []);

  useEffect(() => {
    const fetchChatSessions = async () => {
      try {
        const sessionResponse = await fetchSimulationHistory();
  
        if (sessionResponse && sessionResponse.history && sessionResponse.history.length > 0) {
          setSessions(sessionResponse.history); // 응답에서 세션 목록을 추출하여 상태 업데이트
  
          // 새로고침 시 가장 최근 세션 불러오기
          const lastSession = sessionResponse.history[0];
          await loadMessages(lastSession.id);
          setCurrentSessionId(lastSession.id);
        } else {
          console.warn("No history found in the session response.");
        }
      } catch (error) {
        console.error('채팅 세션을 불러오는데 실패했습니다.', error);
      }
    };
  
    fetchChatSessions();
  }, []);

  // 세션 삭제 함수 추가
  const handleDeleteSession = async (sessionId: number) => {
    try {
      await deleteSession(sessionId);
      // 삭제 후 세션 목록을 필터링하여 삭제된 세션을 제외하고 목록 업데이트
      setSessions(sessions.filter((session) => session.id !== sessionId));
      // 현재 세션이 삭제된 세션이면 채팅 기록 초기화
      if (currentSessionId === sessionId) {
        setChatHistory([]);
        setCurrentSessionId(null);
      }
    } catch (error) {
      console.error('Failed to delete session:', error);
    }
  };  

  // 세션 클릭 시 해당 세션의 메시지 불러오기
  // const loadMessages = async (sessionId: number) => {
  //   try {
  //     const response = await fetchIdSession(sessionId);
  //     setChatHistory(response.messages);
  //     setCurrentSessionId(sessionId); // 현재 세션 ID 업데이트
  //   } catch (error) {
  //     console.error('Failed to load messages:', error);
  //   }
  // };

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
      // endOfMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
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

  // // 채팅 목록이 업데이트될 때 자동 스크롤 범인 이 부분이 화면 스크롤과 채팅방 스크롤이 같이 하단으로 가게 한 범인
  // useEffect(() => {
  //   endOfMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
  // }, [chatHistory]);

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

 

  // 2. chatHistory가 업데이트될 때만 채팅 목록을 최하단으로 스크롤
  // useEffect(() => {
  //   if (chatHistory.length > 0) {
  //     // 메시지 추가 시에만 최하단으로 스크롤
  //     endOfMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
  //   }
  // }, [chatHistory]);

  return (
    <div className='chatRoom flex flex-col items-center bg-[#fcfcf8]'>
      <div className='mt-[70px] flex flex-col items-center'>
        <div className='text-[28px] font-bold text-black'>AI 코치</div>
        <div className='mt-[10px] w-[100px] border-b-2 border-[#DAD789]'></div>
      </div>

      <div className='mt-[40px] flex text-[25px]'>
        <div>
          '<span className='text-[30px] font-bold'>면접</span>'을 입력해보세요! &nbsp; &nbsp;
        </div>
        
      </div>

      <div className='mt-[30px] mb-[50px] flex w-[1130px] justify-center'>
        <div className='flex gap-[30px]'>
          <div className='Left-list h-[850px] w-[300px] rounded-[20px] border border-[#8D8B67]  bg-yellow-50'>
            <div className='flex h-[80px] w-[300px] flex-col items-center justify-center rounded-t-[30px] border border-b-[#626146]'>
              <p className='text-[25px]'>최근 채팅 목록</p>
            </div>
            <div className='h-[calc(100%_-_100px)] p-[15px]'>
              <div className='h-full w-full'>
                <ul className='flex h-[700px] flex-col gap-[10px] overflow-y-auto p-[10px]'>
                {sessions.map((session) => (
                    <li
                      key={session.id}
                      onClick={() => loadMessages(session.id)}
                      className='flex cursor-pointer flex-col gap-[10px] rounded-[10px] border border-[#626146] pl-[30px] pt-[10px] pb-[10px] text-[20px] text-[#626146] bg-white hover:border-black'
                    >
                      <div className='flex justify-between items-center'>
                        <div className='flex items-center gap-[5px]'>
                        {/* onClick={() => loadMessages(session.id)} */}
                          <div className='mt-[5px] text-[20px] font-bold'>{session.topic}</div>
                        </div>
                        {/* 삭제 버튼 추가 */}
                        <button
                          onClick={() => handleDeleteSession(session.id)}
                          className='ml-[20px] mr-[20px] rounded-full text-black-500 hover:text-red-700'
                        >
                          X
                        </button>
                      </div>
                      <div>{changeDateWithFormat(session.createdAt)}</div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className='ID-container h-[850px] w-[900px] rounded-[20px] border border-[#8D8B67]'>
            <div className='flex h-[80px] w-full items-center justify-between rounded-t-[20px] border-b border-black bg-[#FBFAEC] pl-[30px] pr-[20px]'>
              <div className='flex text-[25px] font-bold'>
                <div className='mr-[5px]'>AI 코치</div>
              </div>
              <button onClick={() => newChat(true)} className='h-[50px] w-[120px] rounded-lg bg-[#C7C4A7] text-[25px] text-center text-[#626146] hover:bg-[#626146] hover:text-white'>
                새 채팅
              </button>
            </div>
            <div ref={chatContainerRef} className='Display-container flex h-[690px] w-full border-b-[1px] border-[#59573D] bg-white overflow-y-auto'
            style={{
              backgroundImage: 'url(ai-bg.jpg), linear-gradient(to bottom, rgba(251, 250, 236, 0.2), rgba(255, 255, 255, 0.2))',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}>
              <ul className='Chatting-list flex h-full w-full flex-col gap-[10px] p-[20px]'>
                {chatHistory.map((item, index) => (
                  <li
                    key={index}
                    ref={(el) => (messageRefs.current[index] = el)} // 각 메시지를 참조하기 위해 ref 저장
                    className={`flex items-start gap-[10px] ${item.sender === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    {item.sender === 'ai' && <img src='../AI_image.png' className='AI-image-class w-[80px] h-[80px]' />}
                    <div className='flex max-w-[80%] flex-col justify-end gap-[5px]'>
                      <div className={`flex ${item.sender === 'user' ? 'justify-end' : ''}`}>
                        <div className='text-[18px] font-bold'>{item.sender === 'user' ? '나' : '설기'}</div> {/* 유저와 AI 구분 */}
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
            <div className='Input-container relative flex h-[80px] w-[900px] items-center justify-center gap-[20px] rounded-b-[20px] border-b'>
              <div className='relative flex w-[100px] items-center justify-center'>
                <img onClick={() => setShowEmojiPicker(!showEmojiPicker)} className='flex h-[45px] w-[45px] cursor-pointer items-center justify-center object-cover' src='../smile.png' alt='이모티콘' />
                {showEmojiPicker && (
                  <div className='absolute left-[10px] top-[-450px]'>
                    <Picker data={data} onEmojiSelect={handleEmojiSelect} /> {/* 이모티콘 선택기 */}
                  </div>
                )}
              </div>
              <div className='flex h-[60px] w-[650px] items-center justify-center'>
                <input
                  className='h-full w-full text-[20px] text-[#59573D] outline-none'
                  placeholder='Type message...'
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>
              <div onClick={handleSend} className='flex h-[60px] w-[130px] cursor-pointer items-center justify-center rounded-[10px] mr-[30px] bg-[#FBFAEC] hover:bg-[#8D8B67]'>
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
