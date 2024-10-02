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
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import Layout from './layout/Layout'; // Layout 컴포넌트 임포트
import PersonalInfoPolicy from './layout/PersonalInfoPolicy';
import TermOfUse from './layout/TermOfUse';

import HomePage from './pages/HomePage';
import MainPage from './pages/MainPage';

import CommunityPostCreate from './pages/Community/CommunityPostCreate';
import CommunityPostDetail from './pages/Community/CommunityPostDetail';
import CommunityPostEdit from './pages/Community/CommunityPostEdit';
import CommunityPostList from './pages/Community/CommunityPostList';
import { LifeGraphDetail } from './pages/LifeGraph/LifeGraphDetail';
import LifeGraphList from './pages/LifeGraph/LifeGraphList';

import ExpertsPage from './pages/ExpertsPage';
import MyPage from './pages/MyPage';

import AICoach from './pages/AICoach';
import NotFound from './pages/NotFound';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Layout을 사용하여 Header와 Footer를 모든 페이지에 적용 */}
        <Route path='/' element={<Layout />}>
          {/* 메인 페이지 */}
          <Route index element={<MainPage />} />

          {/* 홈페이지 */}
          <Route path='HomePage' element={<HomePage />} />

          {/* 커뮤니티 관련 라우트 */}
          <Route path='community'>
            {/* 기본으로 게시글 리스트를 렌더링 */}
            <Route index element={<CommunityPostList />} />
            {/* 게시글 상세 페이지 */}
            <Route path=':id' element={<CommunityPostDetail />} />
            {/* 게시글 작성 페이지 */}
            <Route path='create' element={<CommunityPostCreate />} />
            {/* 게시글 수정 페이지 */}
            <Route path='edit/:id' element={<CommunityPostEdit />} />
          </Route>

          {/* 1대1 채팅방 */}
          {/* <Route path='chat' element={<ChatRoom />} />

          {/* AI 코치 */}
          <Route path='ai-coach/:id?' element={<AICoach />} />

          {/* 인생 그래프 관련 라우트 */}
          <Route path='life-graph'>
            {/* 기본 경로에서 표시될 컴포넌트 */}
            <Route index element={<LifeGraphList />} />
            <Route path='detail/:id' element={<LifeGraphDetail />} />
          </Route>

          {/* 마이페이지 관련 라우트 */}
          <Route path='my-page' element={<MyPage />} />

          {/* 전문가 상담 페이지 */}
          <Route path='experts' element={<ExpertsPage />} />

          {/* 푸터 관련 라우트 */}
          <Route path='/personal-info-policy' element={<PersonalInfoPolicy />} />
          <Route path='/term-of-use' element={<TermOfUse />} />

          {/* 404 Not Found 페이지 */}
          <Route path='*' element={<NotFound />} />
          <Route path='/not-found' element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
