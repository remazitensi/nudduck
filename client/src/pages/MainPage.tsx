/**
 * File Name    : MainPage.tsx
 * Description  : 메인페이지
 * Author       : 황솜귤
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.12    황솜귤      Created     메인 페이지 생성
 * 2024.09.17    황솜귤      Modified    Intersection Observer(React)로 텍스트 애니메이션 효과 추가
 * 2024.09.19    황솜귤      Modified    전체 섹션 레이아웃 배치
 * 2024.09.19    황솜귤      Modified    TailwindCSS 변환
 * 2024.09.30    황솜귤      Modified    세부 디자인 수정
 * 2024.10.02    황솜귤      Modified    메인 페이지 이미지 변경
 */

import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useScrollToTop from '../hooks/useScrollToTop';
import './MainPage.css'; // CSS 파일 유지 가능 (일부 스타일링 적용)

/**
 * MainPage Component
 * - IntersectionObserver를 사용해 텍스트 애니메이션 효과 적용
 * - TailwindCSS를 사용해 스타일 적용
 */
const MainPage = () => {
  const textRef = useRef<HTMLParagraphElement>(null); // 텍스트를 참조할 useRef 생성
  const imageRef = useRef<HTMLImageElement>(null); // 이미지를 참조할 useRef 생성
  const [isImageVisible, setIsImageVisible] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true); // 스크롤 최상단 상태 관리
  const navigate = useNavigate();
  useScrollToTop();
  // Intersection Observer 사용 (텍스트)
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
        } else {
          entry.target.classList.remove('fade-in');
        }
      });
    });

    if (textRef.current) {
      observer.observe(textRef.current); // 텍스트 요소 관찰 시작
    }

    return () => {
      if (textRef.current) {
        observer.unobserve(textRef.current); // 컴포넌트 언마운트 시 관찰 해제
      }
    };
  }, []);

  // Intersection Observer 사용 (이미지)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsImageVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }, // 이미지가 10% 뷰포트에 들어왔을 때 애니메이션 트리거
    );

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    return () => {
      if (imageRef.current) {
        observer.unobserve(imageRef.current);
      }
    };
  }, []);

  // 화살표 클릭 시 부드러운 스크롤 이동
  const handleArrowClick = () => {
    window.scrollTo({
      top: window.scrollY + 800, // 현재 위치에서 800px 밑으로 스크롤
      behavior: 'smooth', // 스크롤이 부드럽게 이동
    });
  };

  // 스크롤 이벤트를 감지하여 최상단에 있는지 여부를 업데이트
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY === 0) {
        setIsAtTop(true); // 스크롤이 최상단에 있을 때
      } else {
        setIsAtTop(false); // 스크롤이 내려갔을 때
      }
    };

    // 스크롤 이벤트 리스너 등록
    window.addEventListener('scroll', handleScroll);

    // 컴포넌트 언마운트 시 이벤트 리스너 해제
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className='main-container m-0 w-full p-0'>
      {/* 상단 배너 */}
      <div
        className='banner flex h-[900px] w-full flex-col items-center justify-start bg-gradient-to-b from-[#979e07] to-white bg-cover bg-center px-5 py-10 text-center text-gray-800'
        style={{ backgroundImage: `url('/mainpage.png')` }}
      >
        <div className='banner-content mt-[65px]'>
          <h1 className='banner-title mb-2 text-3xl font-extrabold'>
            <span className='extrabold'>누워서</span>
            <span className='extrabold animate-bounce text-[#909700]'> 떡 </span>
            <span className='extrabold'>먹기</span>
            <span className='semibold text-gray-800'>처럼 쉬운 면접 준비!</span>
          </h1>
          <h2 className='text-xl font-semibold'>“누떡”이 도와줄게~</h2>
        </div>
      </div>

      {/* 화살표 이미지 (최상단일 때만 표시) */}
      {isAtTop && (
        <img
          src='/main-page-arrow.png'
          alt='Arrow Down'
          className='arrow-down fixed bottom-10 left-1/2 h-[142px] w-[166px] -translate-x-1/2 transform animate-pulse opacity-100'
          onClick={handleArrowClick} // 클릭 이벤트 핸들러 추가
        />
      )}

      {/* 나머지 섹션 (기존 내용 유지) */}
      {/* 텍스트 설명 */}
      <h2 className='font-regular my-8 mt-36 text-center text-2xl transition-transform duration-300 hover:scale-105'>나의 인생을 그래프로 요약하고,</h2>

      {/* 이미지로 대체되는 그래프 섹션 */}
      <section className='image-section px-[200px]'>
        <img
          ref={imageRef}
          src='graph-sample.png'
          alt='life-graph'
          className={`full-width-image mb-[200px] mt-[200px] transition-transform duration-1000 ${isImageVisible ? 'translate-y-0 transform opacity-100' : 'translate-y-10 transform opacity-0'}`}
        />
      </section>

      {/* AI 소개 섹션 */}
      <section className='ai-section relative mt-12 inline-block'>
        <img src='ai-solution.png' alt='ai-solution' className='block w-full' />
        <p
          ref={textRef}
          className='fade-in absolute left-[50%] top-[20%] -translate-x-1/2 -translate-y-1/2 transform text-center text-2xl font-normal text-black transition-transform duration-300 hover:scale-105'
        >
          <strong className='highlight font-semibold'>인공지능</strong>으로부터 해답을 찾아 보세요
        </p>
      </section>

      {/* 상담 봇 섹션 */}
      <section className='chatbot-section flex items-center justify-center py-12'>
        <div className='chatbot-placeholder relative inline-block w-full text-center'>
          <img src='ai-simulation.png' alt='ai-simulation' className='chatbot-image h-auto w-full' />
          {/* 텍스트를 flex를 이용해 정확히 중앙에 위치 */}
          <div className='absolute inset-0 flex items-center justify-center'>
            <p className='text-2xl font-medium text-gray-800 transition-transform duration-300 hover:scale-105'>
              <strong>누떡</strong>에서는 희망 직군의 가상 면접을 지원합니다
            </p>
          </div>
        </div>
      </section>

      {/* AI 실전 면접 시나리오 섹션 */}
      <section className='scenario flex items-center justify-center py-12'>
        <div className='scenario-placeholder w-full text-center'>
          <img src='scenario.png' alt='scenario' className='scenario-image h-auto w-full' />
          <p className='mt-[100px] text-2xl font-bold transition-transform duration-300 hover:scale-105'>
            AI Coach<span className='font-normal'>와의 채팅을 통해 가상 면접에 대한 분석을 진행하고</span>
          </p>
        </div>
      </section>

      {/* AI 코치 섹션 */}
      <section className='ai-coach flex items-center justify-center py-12'>
        <div className='ai-coach-placeholder w-full text-center'>
          <img src='ai-coach.png' alt='ai-coach' className='ai-coach-image h-auto w-full' />
          <p className='mt-[100px] text-2xl transition-transform duration-300 hover:scale-105'>원하는 상대와 취업 커뮤니티를 형성하세요</p>
        </div>
      </section>

      {/* 하단 설명 섹션 */}
      <section className='qna-section my-6 py-[300px]'>
        {/* py로 위아래 여백을 추가하여 높이 확장 */}
        <div className='qna-item mx-auto flex max-w-[1000px] items-start justify-between'>
          <h2 className='qna-question w-[45%] transform text-left text-xl font-bold transition-transform duration-300 hover:scale-105 hover:opacity-90'>
            <strong>Q.</strong> 취업 준비를 쉽고 재미있게 할 수 있을까?
          </h2>
          <p className='qna-answer w-[55%] transform text-right text-lg text-gray-700 transition-transform duration-300 hover:scale-105 hover:opacity-90'>
            <strong>A.</strong> 당연하죠! <span className='highlight font-bold text-[#909700]'>누떡</span>에서는 취업 준비를 누워서 떡 먹듯 할 수 있습니다!
          </p>
        </div>
      </section>

      {/* FAQ 섹션 */}
      <section className='faq-section bg-[#FFFFFF] px-[10%] py-[200px] text-center'>
        <div className='faq-grid grid grid-cols-1 gap-8 md:grid-cols-2'>
          {/* 첫 번째 박스: AI 면접 컨설팅 */}
          <div onClick={() => navigate('/HomePage')} className='faq-item transform rounded-xl bg-[#ECEBD4] p-10 text-center shadow-md transition-transform duration-300 hover:-translate-y-2'>
            <img src='/box-icon-1.png' alt='AI 면접 컨설팅 아이콘' className='box-icon mx-auto mb-6 h-24 w-24' />
            <h4 className='mb-4 text-[28px] font-bold'>AI 면접 컨설팅</h4>
            <ul className='mx-4 list-none p-0 text-left text-[22px]'>
              {' '}
              {/* 텍스트 크기를 22px로 조정 */}
              <li className='mb-3 !text-[16px] text-gray-700'>1. 온라인으로 언제 어디서나</li>
              <li className='mb-3 !text-[16px] text-gray-700'>2. AI를 통한 실전과 유사한 면접 프로세스</li>
            </ul>
          </div>

          {/* 두 번째 박스: 커뮤니티 공간 */}
          <div onClick={() => navigate('/community')} className='faq-item transform rounded-xl bg-[#ECEBD4] p-10 text-center shadow-md transition-transform duration-300 hover:-translate-y-2'>
            <img src='/box-icon-2.png' alt='커뮤니티 공간 아이콘' className='box-icon mx-auto mb-6 h-24 w-24' />
            <h4 className='mb-4 text-[28px] font-bold'>커뮤니티 공간</h4>
            <ul className='mx-4 list-none p-0 text-left text-[22px]'>
              <li className='mb-3 !text-[16px] text-gray-700'>1. 게시판을 활용한 글쓰기</li>
              <li className='mb-3 !text-[16px] text-gray-700'>2. 원하는 주제로 적합한 상대와 온라인 미팅</li>
              <li className='mb-3 !text-[16px] text-gray-700'>3. 유저들과 활발한 정보 공유</li>
            </ul>
          </div>

          {/* 세 번째 박스: 인생 그래프 */}
          <div onClick={() => navigate('/HomePage')} className='faq-item transform rounded-xl bg-[#ECEBD4] p-10 text-center shadow-md transition-transform duration-300 hover:-translate-y-2'>
            <img src='/box-icon-3.png' alt='인생 그래프 아이콘' className='box-icon mx-auto mb-6 h-24 w-24' />
            <h4 className='mb-4 text-[28px] font-bold'>인생 그래프</h4>
            <ul className='mx-4 list-none p-0 text-left text-[22px]'>
              <li className='mb-3 !text-[16px] text-gray-700'>1. 유저 정보 기반의 그래프 작성</li>
              <li className='mb-3 !text-[16px] text-gray-700'>2. 일대기를 그래프로 표시</li>
              <li className='mb-3 !text-[16px] text-gray-700'>3. 향후 방향성 및 목표 설계</li>
            </ul>
          </div>

          {/* 네 번째 박스: 전문가 상담 */}
          <div onClick={() => navigate('/experts')} className='faq-item transform rounded-xl bg-[#ECEBD4] p-10 text-center shadow-md transition-transform duration-300 hover:-translate-y-2'>
            <img src='/box-icon-4.png' alt='전문가 상담 아이콘' className='box-icon mx-auto mb-6 h-24 w-24' />
            <h4 className='mb-4 text-[28px] font-bold'>전문가 상담</h4>
            <ul className='mx-4 list-none p-0 text-left text-[22px]'>
              <li className='mb-3 !text-[16px] text-gray-700'>1. 전문가의 심층 상담 제공</li>
              <li className='mb-3 !text-[16px] text-gray-700'>2. 다양한 분야의 전문 지식 공유</li>
              <li className='mb-3 !text-[16px] text-gray-700'>3. 온라인을 통한 간편한 상담</li>
            </ul>
          </div>
        </div>
      </section>

      <div className='cta-container sticky bottom-0 z-50 mt-12 pb-5 text-center'>
        <div className='flex-container sticky flex items-center justify-center gap-x-[600px]'>
          <p className='text-lg font-semibold'>
            AI 코치 <strong>누떡</strong>과 함께 면접 준비를 시작해 보세요!
          </p>
          <a
            onClick={() => navigate('/HomePage')}
            className='cta-button mb-2 ml-2 inline-block rounded bg-[#909700] px-5 py-2 text-base text-white'
            // onClick={(e) => {
            //   // e.preventDefault(); // 기본 동작 방지
            //   window.scrollTo({ top: 0, behavior: 'smooth' }); // 최상단으로 스크롤
            // }}
          >
            홈페이지 바로가기
          </a>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
