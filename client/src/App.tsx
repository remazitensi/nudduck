/**
 * File Name    : App.tsx
 * Description  : 라우트 경로 설정 및 헤더, 푸터 적용
 * Author       : 황솜귤
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.05    김민지      Created
 * 2024.09.07    김민지      Modified    초기화
 * 2024.09.10    황솜귤      Modified    헤더 및 푸터 컴포넌트 추가 및 전역 적용
 * 2024.09.12    김민지      Modified    라우터 설계
 * 2024.09.12    황솜귤      Modified    주석 처리
 * 2024.09.26    김민지      Modified    라우터 변동사항 통합
 */

import React from 'react';

// import CustomerSupportPage from './pages/CustomerSupportPage';
// import NotFound from './pages/NotFound';
// import Unauthorized from './pages/Unauthorized';

const App: React.FC = () => {
  return (
    <>
      <div></div>
      <h1>Vite + React</h1>
      <div className='card'>
        <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
        <p>셋업 성공!</p>
      </div>
    </>
  );
};

export default App;
