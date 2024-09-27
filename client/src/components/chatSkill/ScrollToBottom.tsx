import React, { useEffect, useRef } from 'react';

interface ScrollToBottomProps {
  chatHistory: Array<{ name: string; msg: string; time: string }>; // chatHistory의 타입을 명확하게 지정할 수 있으면 좋습니다.
}

const ScrollToBottom: React.FC<ScrollToBottomProps> = ({ chatHistory }) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 채팅 목록이 업데이트될 때 스크롤을 하단으로 이동
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  return <div ref={endOfMessagesRef} />;
};

export default ScrollToBottom;
