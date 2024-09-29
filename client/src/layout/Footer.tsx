/**
 * File Name    : Footer.tsx
 * Description  : 푸터 컴포넌트 - 사이트 하단에 정보 표시 및 스크롤 업 버튼 추가
 * Author       : 황솜귤
 * 
 * History
 * Date          Author      Status      Description
 * 2024.09.10    황솜귤      Created     푸터 컴포넌트 생성
 * 2024.09.11    황솜귤      Modified    텍스트 마진 및 구분선 색상 수정
 * 2024.09.13    황솜귤      Modified    스크롤 업 버튼 추가
 * 2024.09.16    황솜귤      Modified    스크롤 업 버튼 최상단에서는 노출되지 않도록 수정
 */

import React, { useState, useEffect } from 'react';
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
    <footer className="footer-container bg-white border-t border-gray-300">
      <div className="container w-[1340px]">
        <div className="footer-links text-sm text-gray-600">
          <a href="#">고객센터</a>
          <a href="#">이용 약관</a>
          <a href="#">개인정보 처리 방침</a>
          <a href="#">운영 정책</a>
        </div>
        <div className="footer-details text-sm text-gray-600 mt-2">
          <p>
            <strong>대표</strong> 김재영 <span className="text-gray-500"> | </span>
            <strong>사업자 번호</strong> 000-00-00000 <span className="text-gray-500"> | </span>
            <strong>사업자 확인</strong> <span className="business-confirmation">사업자 확인</span> <span className="text-gray-500"> | </span>
            <strong>주소</strong> 민지특별시 우현구 형선로 000, 10층(NUDDUCK) <span className="text-gray-500"> | </span>
            <strong>대표 전화</strong> 1544-0000
          </p>
          <p>
            <strong>고객 문의</strong> cs@nudduck.com <span className="text-gray-500"> | </span> 
            <strong>개인정보 관리 책임자</strong> 이승철(personal@nudduck.com)
          </p>
        </div>
        <div className="footer-copyright text-sm text-gray-500 mt-4">
          <p>copyright ⓒ 2024 All rights reserved by NUDDUCK</p>
        </div>

        {/* 스크롤 업 버튼 추가 */}
        {showScrollButton && ( // 스크롤이 100px 이상일 때만 버튼을 보여줌
          <div className="scroll-up-button" onClick={handleScrollUp}>
            <img src="/scroll-up.png" alt="Scroll Up" className="scroll-up-icon" />
          </div>
        )}
      </div>
    </footer>
  );
};

export default Footer;
