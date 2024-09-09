/*
 * File Name    : App.tsx
 * Description  : 라우트 경로를 설정하는 곳
 * Author       : 김민지
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.05    김민지      Created
 * 2024.09.07    김민지      Modified       초기화
 * 2024.09.09    황솜귤      Created     헤더 라우터 설정
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/header-component';

function App() {
  return (
    <Router>
     <Header /> {/* 헤더를 모든 페이지에 공통으로 표시 */}
      <Routes>
     </Routes>
    </Router>
);
}

export default App;
