/**
 * File Name    : footer-component.tsx
 * Description  : 푸터 컴포넌트
 * Author       : 황솜귤
 * 
 * History
 * Date          Author      Status      Description
 * 2024.09.10    황솜귤      Created     푸터 컴포넌트 생성
 */


import './footer-component.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer bg-gray-800 text-gray-300 py-8">
      <div className="container mx-auto text-center">
        {/* 상단 링크 부분 */}
        <div className="footer-links flex justify-center space-x-8 border-b border-gray-500 pb-4 mb-4">
          <a href="#" className="hover:font-bold">고객센터</a>
          <a href="#" className="hover:font-bold">이용 약관</a>
          <a href="#" className="hover:font-bold">개인정보 처리 방침</a>
          <a href="#" className="hover:font-bold">운영 정책</a>
        </div>

        {/* 하단 회사 정보 부분 */}
        <div className="footer-info text-gray-300">
          <p>
            <strong>대표</strong> 김재영 <strong>사업자 번호</strong> 000-00-00000 <a href="#" className="border px-2 py-1 text-xs hover:bg-gray-700">사업자 확인</a> <strong>주소</strong> 민지특별시 우현구 형선로 000, 10층(NUDDUCK) <strong>대표 전화</strong> 1544-0000
          </p>
          <p>
            <strong>고객 문의</strong> cs@nudduck.com <strong>개인정보 관리 책임자</strong> 이승철 (personal@nudduck.com)
          </p>
          <p className="text-xs mt-4">copyright ⓒ 2024 All rights reserved by NUDDUCK</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;