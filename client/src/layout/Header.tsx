/**
 * File Name    : Header.tsx
 * Description  : 헤더 컴포넌트 - 로그인 전후 상태에 따라 상이한 UI
 * Author       : 황솜귤
 * 
 * History
 * Date          Author      Status      Description
 * 2024.09.05    황솜귤      Created     헤더 컴포넌트 생성
 * 2024.09.09    황솜귤      Modified    router 연결
 * 2024.09.11    황솜귤      Modified    loginModal 연동 및 상태 변경 처리
 * 2024.09.12    황솜귤      Modified    소셜 로그인 및 사용자 정보 연동 처리
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // useNavigate 추가
import axios from 'axios';
import LoginModal from '../components/LoginModal';

const Header: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({
    name: '',
    email: '',
    profileImage: ''
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 추가
  const navigate = useNavigate(); // 홈페이지 이동을 위한 네비게이트 훅 추가

  useEffect(() => {
    if (isLoggedIn) {
      fetchUserData();
    }
  }, [isLoggedIn]);

  // 사용자 정보 요청 함수
  const fetchUserData = async () => {
    try {
      const response = await axios.get('/api/my');
      setUser({
        name: response.data.name,
        email: response.data.email,
        profileImage: response.data.imageUrl || 'https://via.placeholder.com/32x32'
      });
    } catch (error) {
      console.error('사용자 정보를 가져오는 데 실패했습니다:', error);
    }
  };

  // 로그인 상태 변경 핸들러(로그인 성공 시 홈페이지로 리다이렉트)
  const handleLogin = () => {
    setIsLoggedIn(true);
    setIsModalOpen(false); // 로그인 모달 닫기
    navigate('/'); // 홈페이지로 리다이렉트
  };

  // 로그아웃 상태 변경 핸들러
  const handleLogoutClick = () => {
    setIsLoggedIn(false);
    setUser({
      name: '',
      email: '',
      profileImage: ''
    });
    setDropdownOpen(false);
  };

  const handleProfileClick = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <header className="w-full bg-white shadow-md">
      <div className="container mx-auto flex justify-between items-center py-4 px-8">
        {/* 로고 및 사이트명 */}
        <div className="flex items-center">
          <img src="/logo.png" className="w-[66px] h-[66px] mr-4" alt="Nudduck Logo" />
          <span className="text-4xl font-bold text-gray-800">NUDDUCK</span>
        </div>

        {/* 로그인 후에만 메뉴 표시 */}
        {isLoggedIn && (
          <nav className="flex space-x-6">
            <Link to="/AICoach" className="hover:text-gray-700">AI 코치</Link>
            <Link to="/ExpertsPage" className="hover:text-gray-700">전문가 상담</Link>
            <Link to="/community" className="hover:text-gray-700">커뮤니티</Link>
            <Link to="/LifeGraphDetail" className="hover:text-gray-700">인생 그래프</Link>
          </nav>
        )}

        {/* 검색창 */}
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder=""
            className="px-4 py-2 border border-gray-300 rounded-full w-[240px]"
          />
          <button>
            <img src="/search.png" alt="검색" className="w-9 h-9" />
          </button>
          <button>
            <img src="/chat.png" alt="채팅" className="w-6 h-6" />
          </button>
        </div>

        {/* 로그인 여부에 따른 사용자 정보 표시 */}
        <div className="flex items-center space-x-4">
          {!isLoggedIn ? (
            <div className="space-x-2">
              <button onClick={() => setIsModalOpen(true)} className="hover:underline">로그인</button>
              <span>|</span>
              <button onClick={() => setIsModalOpen(true)} className="hover:underline">회원가입</button>
            </div>
          ) : (
            <div className="relative" onClick={handleProfileClick}>
              <img src={user.profileImage} alt="Profile" className="w-8 h-8 rounded-full cursor-pointer" />
              <div className="text-sm font-semibold">{user.name}</div>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-xl z-20">
                  <p className="px-4 py-2 text-gray-700">{user.name} 님</p>
                  <p className="px-4 py-2 text-gray-700">{user.email}</p>
                  <Link to="/mypage" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">마이페이지</Link>
                  <a href="#" onClick={handleLogoutClick} className="block px-4 py-2 text-gray-800 hover:bg-gray-200">로그아웃</a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 로그인 모달 */}
      {isModalOpen && <LoginModal onLogin={handleLogin} onClose={() => setIsModalOpen(false)} />}
    </header>
  );
};

export default Header;



// TODO:
// 메인/홈페이지 작업 후 로고 링크 기능이 추가될 것입니다. 
// 검색 아이콘, 채팅 아이콘 링크 기능은 추후에 구현될 것입니다.
// 로고 이미지, 로고 텍스트, 검색창의 사이즈가 다듬어져야 합니다.
// 유저 프로필 클릭 시 나오는 드롭다운의 스타일이 다듬어져야 합니다.
// 헤더 전체 여기저기 들어가는 여백이 다듬어져야 합니다.
// 전역이나 헤더 자체에서의 w-[1920px]이 아닌 브라우저 사이즈에 따른 반응형 개선이 필요합니다.
