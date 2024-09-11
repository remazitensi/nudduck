// import { Routes } from 'react-router-dom';
// /*
//  * File Name    : App.tsx
//  * Description  : 라우트 경로를 설정하는 곳
//  * Author       : 김민지
//  *
//  * History
//  * Date          Author      Status      Description
//  * 2024.09.05    김민지      Created
//  * 2024.09.07    김민지      Modified       초기화
//  */

// import './App.css';

// function App() {
//   return (
//     <Routes>
//       {/* <Route path='/' element={<Root />} /> */}
//       {/* <Route path='/my' element={<My />} /> */}
//     </Routes>
//   );
// }

// export default App;
// App.tsx

// App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes } from 'react-router-dom';
// TODO: Layout 컴포넌트 만들기! 
// import Layout from './components/Layout'; // Layout 컴포넌트 임포트
// import MainPage from './pages/MainPage';
// import HomePage from './pages/HomePage';
// import LoginModal from './pages/LoginModal';
// import CommunityPostList from './pages/CommunityPostList';
// import CommunityPostDetail from './pages/CommunityPostDetail';
// import CommunityPostCreate from './pages/CommunityPostCreate';
// import CommunityPostEdit from './pages/CommunityPostEdit';
// import ChatRoom from './pages/ChatRoom';
// import AICoach from './pages/AICoach';
// import LifeGraphList from './pages/LifeGraphList';
// import LifeGraphDetail from './pages/LifeGraphDetail';
// import LifeGraphCreateModal from './pages/LifeGraphCreateModal';
// import LifeGraphGuideModal from './pages/LifeGraphGuideModal';
// import MyPage from './pages/MyPage';
// import EditProfileModal from './pages/EditProfileModal';
// import DeleteAccountModal from './pages/DeleteAccountModal';
// import ConsultationPage from './pages/ConsultationPage';
// import ExpertProfileModal from './pages/ExpertProfileModal';
// import CustomerSupportPage from './pages/CustomerSupportPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Layout을 사용하여 Header와 Footer를 모든 페이지에 적용 */}
        {/* <Route path="/" element={<Layout />}> */}
          {/* 메인 페이지 */}
          {/* <Route index element={<MainPage />} /> */}

          {/* 홈페이지 */}
          {/* <Route path="home" element={<HomePage />} /> */}

          {/* 로그인 모달 */}
          {/* <Route path="login" element={<LoginModal />} /> */}

          {/* 커뮤니티 관련 라우트 */}
          {/* <Route path="community"> */}
            {/* 기본으로 게시글 리스트를 렌더링 */}
            {/* <Route index element={<CommunityPostList />} /> */}
            {/* 게시글 상세 페이지 */}
            {/* <Route path=":id" element={<CommunityPostDetail />} /> */}
            {/* 게시글 작성 페이지 */}
            {/* <Route path="create" element={<CommunityPostCreate />} /> */}
            {/* 게시글 수정 페이지 */}
            {/* <Route path="edit/:id" element={<CommunityPostEdit />} /> */}
          {/* </Route> */}

          {/* 1대1 채팅방 */}
          {/* <Route path="chat" element={<ChatRoom />} /> */}

          {/* AI 코치 */}
          {/* <Route path="ai-coach" element={<AICoach />} /> */}

          {/* 인생 그래프 관련 라우트 */}
          {/* <Route path="life-graph">
            <Route path="list" element={<LifeGraphList />} />
            <Route path="detail/:id" element={<LifeGraphDetail />} />
            <Route path="create" element={<LifeGraphCreateModal />} />
            <Route path="guide" element={<LifeGraphGuideModal />} />
          </Route> */}

          {/* 마이페이지 관련 라우트 */}
          {/* <Route path="my-page">
            <Route index element={<MyPage />} />
            <Route path="edit-profile" element={<EditProfileModal />} />
            <Route path="delete-account" element={<DeleteAccountModal />} />
          </Route> */}

          {/* 전문가 상담 페이지 */}
          {/* <Route path="consultation" element={<ConsultationPage />} />
          <Route path="consultation/expert-profile" element={<ExpertProfileModal />} /> */}

          {/* 고객센터 페이지 */}
          {/* <Route path="support" element={<CustomerSupportPage />} /> */}
        {/* </Route> */}
      </Routes>
    </Router>
  );
};

export default App;
