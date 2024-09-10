/**
 * File Name    : header-component.tsx
 * Description  : 헤더 컴포넌트 - 로그인 전후 상태에 따라 상이한 UI
 * Author       : 황솜귤
 * 
 * History
 * Date          Author      Status      Description
 * 2024.09.05    황솜귤      Created     헤더 컴포넌트 생성
 * 2024.09.06    황솜귤      Modified    API 요청
 * 2024.09.09    황솜귤      Modified    router 연결
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './header-component.css';

const Header: React.FC = () => {
  // 로그인 여부 추적
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({
    name: '',
    email: '',
    profileImage: ''
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // 컴포넌트가 마운트될 때 사용자 정보를 가져오는 함수
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
        profileImage: response.data.imageUrl || 'default-profile.png'
      });
    } catch (error) {
      console.error('사용자 정보를 가져오는 데 실패했습니다:', error);
    }
  };

  // 로그인 상태 변경 핸들러
  const handleLoginClick = () => {
    setIsLoggedIn(true);
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
    <header className="header">
      <div className="logo-container">
        {/* 절대 경로로 이미지 설정 (이미지가 public 폴더에 위치) */}
        <img src="/logo.png" className="logo" alt="Nudduck Logo" />
        <img src="/nudduck.png" className="logo" alt="Nudduck" />
      </div>

      <div className="menu-container">
        {/* 검색창 */}
        <div className="search-container">
          <input
            type="text"
            placeholder=" "
            className="border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="ml-2">
            <img src="/search.png" alt="검색" className="icon" />
          </button>
          <button className="ml-2">
            <img src="/chat.png" alt="채팅" className="icon" />
          </button>
        </div>

        {!isLoggedIn ? (
          <>
            <Link to="/login" onClick={handleLoginClick}>로그인</Link> | <Link to="/signup">회원가입</Link>
          </>
        ) : (
          <>
            <nav>
              <Link to="/ai-coach">AI 코치</Link>
              <Link to="/expert-consultation">전문가 상담</Link>
              <Link to="/community">커뮤니티</Link>
              <Link to="/life-graph">인생 그래프</Link>
            </nav>
            <div className="relative">
              <img
                src={user.profileImage}
                alt="Profile"
                className="profile-image cursor-pointer"
                onClick={handleProfileClick}
              />
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg z-10">
                  <p className="p-4">{user.name} 님</p>
                  <p className="p-4 text-sm text-gray-500">{user.email}</p>
                  <Link to="/mypage" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">마이페이지</Link>
                  <a href="#" onClick={handleLogoutClick} className="block px-4 py-2 text-gray-800 hover:bg-gray-200">로그아웃</a>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;