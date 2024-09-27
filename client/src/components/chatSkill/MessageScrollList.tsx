import React, { useRef } from 'react';

interface MessageScrollListProps {
  messages: string[]; // 메시지 배열 (string 타입으로 예시)
  onMessageClick: (index: number) => void; // 특정 메시지 클릭 시 동작하는 함수
}

const MessageScrollList: React.FC<MessageScrollListProps> = ({ messages, onMessageClick }) => {
  // 각 메시지를 참조하기 위한 ref 배열
  const messageRefs = useRef<Array<HTMLLIElement | null>>([]);

  // 메시지의 index로 스크롤 이동하는 함수
  const scrollToMessage = (index: number) => {
    const targetElement = messageRefs.current[index]; // 해당 메시지 참조
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' }); // 해당 위치로 부드럽게 이동
    }
  };

  return (
    <ul className='Chatting-list flex h-full w-full flex-col gap-[10px] overflow-y-auto p-[20px]'>
      {messages.map((item, index) => (
        <li
          key={index}
          ref={(el) => (messageRefs.current[index] = el)} // 각 메시지를 참조하기 위해 ref 저장
          onClick={() => onMessageClick(index)} // 클릭 시 해당 메시지로 스크롤
          className='flex items-start gap-[10px]'
        >
          <img className='h-[100px] w-[100px] object-cover' src='/cat_image.png' alt='고양이 이미지' />
          <div className='flex max-w-[80%] flex-col justify-end gap-[5px]'>
            <div className='text-[20px] font-bold'>{item}</div>
            <div className='max-w-[300px] break-words rounded-[10px] bg-[#EEF9FF] p-3 text-[20px] shadow-xl'>{item}</div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default MessageScrollList;
