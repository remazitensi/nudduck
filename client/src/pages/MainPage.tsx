/**
 * File Name    : MainPage.tsx
 * Description  : 메인페이지
 * Author       : 황솜귤
 * 
 * History
 * Date          Author      Status      Description
 * 2024.09.12    황솜귤      Created     메인페이지 생성
 * 2024.09.17    황솜귤      Modified    Intersection Observer(React)로 텍스트 애니메이션 효과 추가
 */

import React, { useEffect, useRef } from 'react';
import './MainPage.css';

const MainPage = () => {
  const textRef = useRef<HTMLParagraphElement>(null); // 텍스트를 참조할 useRef 생성

  // Intersection Observer 사용
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
          } else {
            entry.target.classList.remove('fade-in');
          }
        });
      },
      { threshold: 0 } // 요소가 조금이라도 뷰포트에 들어오면 트리거
    );

    if (textRef.current) {
      observer.observe(textRef.current); // 텍스트 요소 관찰 시작
    }

    return () => {
      if (textRef.current) {
        observer.unobserve(textRef.current); // 컴포넌트 언마운트 시 관찰 해제
      }
    };
  }, []);

  const handleArrowClick = () => {
    window.scrollTo({
      top: window.scrollY + 800, // 현재 위치에서 800px 밑으로 스크롤
      behavior: 'smooth' // 스크롤이 부드럽게 이동
    });
  };

  return (
    <div className="main-container">
      {/* 상단 배너 */}
      <div className="banner">
        <div className="banner-content">
          <h1 className="banner-title">
            <span className="extrabold">누워서</span>
            <span className="extrabold white-text"> 떡 </span>
            <span className="extrabold">먹기</span>
            <span className="semibold">처럼 쉬운 면접 준비!</span>
          </h1>
          <h2>“누떡”이 도와줄게~</h2>
          <img
            src="/main-page-arrow.png"
            alt="Arrow Down"
            className="arrow-down"
            onClick={handleArrowClick} // 클릭 이벤트 핸들러 추가
          />
        </div>
      </div>

      <div className='cta-container'>
        <div className="flex-container">
          <p>AI 코치 <strong>누떡</strong>과 함께 면접 준비를 시작해 보세요!</p>
          <a href="#" className="cta-button">면접 준비 바로가기</a>
        </div>
      </div>

      {/* 이미지로 대체되는 그래프 섹션 */}
      <section className="image-section">
        <img src="/path/to/graph-image.jpg" alt="life-graph" className="full-width-image" />
      </section>

      {/* 추가 섹션 (인공지능 소개) */}
      <section className="ai-section">
        <img src="ai-solution.png" alt="ai-solution" />
        <p ref={textRef}>
          <strong>인공지능</strong>으로부터 해답을 찾아 보세요
        </p>
      </section>

      {/* 상담 봇 섹션 */}
      <section className="chatbot-section">
        <div className="chatbot-placeholder">
          <img src="scenario.png" alt="ai-scenario" />
        </div>
        <p>누떡에서는 희망 직군의 가상 면접을 지원합니다</p>
      </section>

      {/* 하단 FAQ 섹션 */}
      <section className="faq-section">
        <h2>취업 준비를 쉽고 재미있게 할 수 있을까요?</h2>
        <p>누떡에서는 취업 준비를 누구나 쉽게 할 수 있습니다!</p>
        <div className="faq-grid">
          <div className="faq-item">AI 면접 컨설팅</div>
          <div className="faq-item">커뮤니티 공간</div>
          <div className="faq-item">인생 그래프</div>
        </div>
      </section>
    </div>
  );
};

export default MainPage;
