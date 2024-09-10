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
import Header from './layout/Header_woohyun';
import Community from './pages/Community';
import CommunityView from './pages/CommunityView';
import CommunityWrite from './pages/CommunityWrite';



import './App.css';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        {/* <Route path='/' element={<Root />} /> */}
        {/* <Route path='/my' element={<My />} /> */}
        <Route path='/community' element={<Community />} />
        <Route path='/communityWrite' element={<CommunityWrite />} />
        <Route path='/communityView' element={<CommunityView />} />
      </Routes>
    </Router>
  );
}

export default App;
