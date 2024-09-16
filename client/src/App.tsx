/*
 * File Name    : App.tsx
 * Description  : 라우트 경로를 설정하는 곳
 * Author       : 김민지
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.05    김민지      Created
 * 2024.09.07    김민지      Modified       초기화
 */

import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import { ExpertsPage } from './pages/ExpertsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<ExpertsPage />} />
      </Routes>
    </Router>
  );
}
export default App;
