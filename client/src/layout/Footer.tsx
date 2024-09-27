/**
 * File Name    : Footer.tsx
 * Description  : 푸터 컴포넌트
 * Author       : 황솜귤
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.10    황솜귤      Created     푸터 컴포넌트 생성
 * 2024.09.11    황솜귤      Modified    텍스트 마진 및 구분선 색상 수정
 * 2024.09.13    황솜귤      Modified    스크롤 업 버튼 추가
 * 2024.09.16    황솜귤      Modified    스크롤 업 버튼 최상단에서는 노출되지 않도록 수정
 * 2024.09.27    황솜귤      Modified    디자인 수정
 */

import React, { useEffect, useState } from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  const [showScrollButton, setShowScrollButton] = useState(false); // 스크롤 버튼 표시 상태

  // 스크롤 시 버튼을 표시할지 여부를 결정하는 함수
  useEffect(() => {
    const handleScroll = () => {
      // 현재 스크롤 위치가 100px 이상일 경우 버튼을 보이도록 설정
      if (window.scrollY > 100) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // 스크롤 업 버튼 클릭 핸들러
  const handleScrollUp = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className='footer-container flex flex-col gap-5 border-t border-gray-300 bg-white pl-10 pt-6'>
      <div className='footer-links flex list-none text-sm text-gray-600'>
        <a href='#' className='mr-6'>
          고객센터
        </a>
        <a href='#' className='mr-6'>
          이용 약관
        </a>
        <a href='#' className='mr-6 font-bold'>
          개인정보 처리 방침
        </a>
        <a href='#'>운영 정책</a>
      </div>

      <div className='flex w-[1000px] flex-wrap gap-x-7'>
        <p className='relative after:ml-3 after:block after:h-2.5 after:w-px after:bg-gray-300'>
          <span className='key mr-2 font-bold'>대표</span>
          <span className='value'>김재영</span>
        </p>
        <p className='relative after:ml-3 after:block after:h-2.5 after:w-px after:bg-gray-300'>
          <span className='key mr-2 font-bold'>사업자 번호</span>
          <span className='value'>000-00-00000</span>
          <span className='ml-3 bg-[#A8A8A8] px-2 text-white'>사업자확인</span>
        </p>
        <p className='relative after:ml-3 after:block after:h-2.5 after:w-px after:bg-gray-300'>
          <span className='key mr-2 font-bold'>주소</span>
          <span className='value'>민지특별시 우현구 형선로 OOO, 10층(NUDDUCK)</span>
        </p>
        <p className='relative after:ml-3 after:block after:h-2.5 after:w-px after:bg-gray-300'>
          <span className='key mr-2 font-bold'>대표 전화</span>
          <span className='value'>1544-0000</span>
        </p>
        <p className='relative after:ml-3 after:block after:h-2.5 after:w-px after:bg-gray-300'>
          <span className='key mr-2 font-bold'>고객 문의</span>
          <span className='value'>cs@nudduck.com</span>
        </p>
        <p className='relative'>
          <span className='key mr-2 font-bold'>개인정보 관리 책임자</span>
          <span className='value'>이승철(personal@nudduck.com)</span>
        </p>
      </div>

      <div className='footer-copyright text-sm text-gray-500'>
        <p>copyright ⓒ 2024 All rights reserved by NUDDUCK</p>
      </div>

      {/* 스크롤 업 버튼 추가 */}
      {showScrollButton && ( // 스크롤이 100px 이상일 때만 버튼을 보여줌
        <div className='scroll-up-button' onClick={handleScrollUp}>
          <img src='/scroll-up.png' alt='Scroll Up' className='scroll-up-icon' />
        </div>
      )}
    </footer>
  );
};

export default Footer;
