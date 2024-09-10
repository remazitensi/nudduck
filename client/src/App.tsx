/**
 * File Name    : App.tsx
 * Description  : 라우트 경로 설정
 * Author       : 황솜귤
 * 
 * History
 * Date          Author      Status      Description
 * 2024.09.05    김민지      Created
 * 2024.09.07    김민지      Modified    초기화
 * 2024.09.10    황솜귤      Modified    헤더 컴포넌트 추가 및 전역 적용
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Header from './layout/header-component'; //
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <Header /> {/* 헤더를 모든 페이지에 공통으로 적용 */}
    <div className="max-w-screen-xl mx-auto"> {/* 1920px 설정 및 중앙 정렬 */}
      <div className="max-w-5xl mx-auto"> {/* 중앙에 1340px 공간 설정 */}
        <h1 className="text-3xl font-bold">Vite + React</h1>
        <div className="card bg-gray-100 p-5 rounded-lg shadow-lg">
          <button
            onClick={() => setCount((count) => count + 1)}
            className="bg-blue-500 text-white p-3 rounded-lg"
          >
            count is {count}
          </button>
          <p className="mt-3">셋업 성공!</p>
        </div>
      </div>
    </div>
      <Routes>
        {/* 추후 페이지 경로 추가 가능 */}
        {/* <Route path="/" element={<HomePage />} /> */}
        {/* <Route path="/about" element={<AboutPage />} /> */}
        <Route path="/" element={<div>메인페이지</div>} /> 
      </Routes>
    </Router>
  );
}

export default App;
