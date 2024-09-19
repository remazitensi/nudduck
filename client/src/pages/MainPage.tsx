/**
 * File Name    : MainPage.tsx
 * Description  : 메인페이지
 * Author       : 황솜귤
 * 
 * History
 * Date          Author      Status      Description
 * 2024.09.12    황솜귤      Created     메인페이지 생성
 * 2024.09.17    황솜귤      Modified    Intersection Observer(React)로 텍스트 애니메이션 효과 추가
 * 2024.09.19    황솜귤      Modified    전체 섹션 레이아웃 배치
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

      <h2 className="text-center text-xl font-bold"> 나의 인생을 그래프로 요약하고,</h2>


      {/* 이미지로 대체되는 그래프 섹션 */}
      <section className="image-section">
        <img src="graph-sample.png" alt="life-graph" className="full-width-image" />
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
          <img src="ai-simulation.png" alt="ai-simulation" className="chatbot-image" />
            <p className="chatbot-text">
            <strong>누떡</strong>에서는 희망 직군의 가상 면접을 지원합니다</p>
        </div>
      </section>

      {/* 하단 설명 섹션 (QnA 형식) */}
      <section className="qna-section my-8">
        <div className="qna-item flex justify-between items-start">
          <h2 className="qna-question w-1/2 text-left">
            <strong>Q.</strong> 취업 준비를 쉽고 재미있게 할 수 있을까?
          </h2>
            <p className="qna-answer w-1/2 text-right">
            <strong>A.</strong> 당연하죠! <span className="highlight">누떡</span>에서는 취업 준비를 누워서 떡 먹듯 할 수 있습니다!
          </p>
        </div>
      </section>


      {/* 하단 설명 섹션 */}
<section className="faq-section">
  <div className="faq-grid">
    <div className="faq-item">
      <img src="/box-icon-1.png" alt="AI 면접 컨설팅 아이콘" className="box-icon"/>
      <h3>AI 면접 컨설팅</h3>
      <ul>
        <li>1. 온라인으로 언제 어디서나</li>
        <li>2. AI를 통한 실전과 유사한 면접 프로세스</li>
        <li>3. 가상 면접 종료 후 즉각적 피드백</li>
      </ul>
    </div>

    <div className="faq-item">
      <img src="/box-icon-2.png" alt="커뮤니티 공간 아이콘" className="box-icon"/>
      <h3>커뮤니티 공간</h3>
      <ul>
        <li>1. 게시판을 활용한 글쓰기</li>
        <li>2. 원하는 주제로 적합한 상대와 온라인 미팅</li>
        <li>3. 유저들과 활발한 정보 공유</li>
      </ul>
    </div>

    <div className="faq-item">
      <img src="/box-icon-3.png" alt="인생 그래프 아이콘" className="box-icon"/>
      <h3>인생 그래프</h3>
      <ul>
        <li>1. 유저 정보 기반의 그래프 작성</li>
        <li>2. 일대기를 그래프로 표시</li>
        <li>3. 향후 방향성 및 목표 설계</li>
      </ul>
    </div>
  </div>
</section>
    </div>
  );
};

export default MainPage;
