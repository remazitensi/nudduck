// /*
//  * File Name    : App.tsx
//  * Description  : 라우트 경로를 설정하는 곳
//  * Author       : 김민지
//  *
//  * History
//  * Date          Author      Status      Description
//  * 2024.09.05    김민지      Created
//  * 2024.09.07    김민지      Modified       초기화
//  * 2024.09.12    김민지      Modified     라우터 설계
//  */

import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
// TODO: Layout 컴포넌트 만들기!

// import Layout from './layout/Layout'; // Layout 컴포넌트 임포트

// import HomePage from './pages/HomePage';
// import MainPage from './pages/MainPage';

import AICoach from './pages/AICoach';
import ChatRoom from './pages/ChatRoom';
// import CommunityPostCreate from './pages/CommunityPostCreate';
// import CommunityPostDetail from './pages/CommunityPostDetail';
// import CommunityPostEdit from './pages/CommunityPostEdit';
// import CommunityPostList from './pages/CommunityPostList';
// import ExpertsPage from './pages/ExpertsPage';
// import LifeGraphDetail from './pages/LifeGraphDetail';
// import LifeGraphList from './pages/LifeGraphList';
// import MyPage from './pages/MyPage';

// import ChatRoom from './pages/ChatRoom';
// import Chatting from './pages/Chatting';

// import CustomerSupportPage from './pages/CustomerSupportPage';
// import NotFound from './pages/NotFound';
// import Unauthorized from './pages/Unauthorized';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Layout을 사용하여 Header와 Footer를 모든 페이지에 적용 */}
        {/* <Route path='/' element={<Layout />}>  */}
        {/* 메인 페이지 */}
        {/* <Route index element={<MainPage />} /> */}

        {/* 홈페이지 */}
        {/* <Route path='home' element={<HomePage />} /> */}

        {/* 커뮤니티 관련 라우트 */}
        <Route path='community'>
          {/* 기본으로 게시글 리스트를 렌더링 */}
          {/* <Route index element={<CommunityPostList />} /> */}
          {/* 게시글 상세 페이지 */}
          {/* <Route path=':id' element={<CommunityPostDetail />} /> */}
          {/* 게시글 작성 페이지 */}
          {/* <Route path='create' element={<CommunityPostCreate />} /> */}
          {/* 게시글 수정 페이지 */}
          {/* <Route path='edit/:id' element={<CommunityPostEdit />} /> */}
        </Route>

        {/* 1대1 채팅방 */}
        <Route path='chat' element={<ChatRoom />} />
        {/* <Route path='chatting' element={<Chatting />} /> */}

        {/* AI 코치 */}
        <Route path="ai-coach/:id?" element={<AICoach />} />

        {/* 인생 그래프 관련 라우트 */}
        <Route path='life-graph'>
          {/* 기본 경로에서 표시될 컴포넌트 */}
          {/* <Route index element={<LifeGraphList />} />
            <Route path='detail/:id' element={<LifeGraphDetail />} /> */}
        </Route>

        {/* 마이페이지 관련 라우트 */}
        {/* <Route path='my-page' element={<MyPage />} /> */}

        {/* 전문가 상담 페이지 */}
        {/* <Route path='experts' element={<ExpertsPage />} /> */}

        {/* 고객센터 페이지 */}
        {/* <Route path='support' element={<CustomerSupportPage />} /> */}

        {/* 401 Unauthorized 페이지 */}
        {/* <Route path='401' element={<Unauthorized />} /> */}

        {/* 404 Not Found 페이지 */}
        {/* <Route path='*' element={<NotFound />} /> */}
        {/* </Route> */}
      </Routes>
    </Router>
  );
};

export default App;
