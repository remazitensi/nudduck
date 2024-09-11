/**
 * File Name    : header-component.tsx
 * Description  : 헤더 컴포넌트 - 로그인 전후 상태에 따라 상이한 UI
 * Author       : 황솜귤
 * 
 * History
 * Date          Author      Status      Description
 * 2024.09.05    황솜귤      Created     헤더 컴포넌트 생성
 * 2024.09.09    황솜귤      Modified    router 연결
 * 2024.09.11    황솜귤      Modified    배치 수정 
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './header-component.css';

const Header: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({
    name: '',
    email: '',
    profileImage: ''
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);

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

  const handleLoginClick = () => {
    setIsLoggedIn(true);
  };

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
      <div className="header-inner">
        {/* 로고 및 사이트명 */}
        <div className="logo-container">
          <img src="/logo.png" className="logo" alt="Nudduck Logo" />
          <span className="logo-text">NUDDUCK</span>
        </div>

        {/* 로그인 후에만 메뉴 표시 */}
        {isLoggedIn && (
          <div className="menu-container">
            <nav className="flex space-x-12">
              <Link to="/ai-coach">AI 코치</Link>
              <Link to="/expert-consultation">전문가 상담</Link>
              <Link to="/community">커뮤니티</Link>
              <Link to="/life-graph">인생 그래프</Link>
            </nav>
          </div>
        )}

        {/* 검색창 */}
        <div className="search-container">
          <input
            type="text"
            placeholder=""
            className="search-input"
          />
          <button>
            <img src="/search.png" alt="검색" className="w-[36px] h-[36px]" />
          </button>
          <button>
            <img src="/chat.png" alt="채팅" className="w-[24px] h-[24px]" />
          </button>
        </div>

        {/* 로그인 여부에 따른 사용자 정보 표시 */}
        <div className="user-section">
          {!isLoggedIn ? (
            <div className="auth-links">
              <Link to="/login" onClick={handleLoginClick}>로그인</Link> | <Link to="/signup">회원가입</Link>
            </div>
          ) : (
            <div className="profile-container" onClick={handleProfileClick}>
              <img src={user.profileImage} alt="Profile" className="profile-image" />
              <div className="profile-name">{user.name}</div>
              {dropdownOpen && (
                <div className="dropdown">
                  <p>{user.name} 님</p>
                  <p>{user.email}</p>
                  <Link to="/mypage">마이페이지</Link> | <a href="#" onClick={handleLogoutClick}>로그아웃</a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;


// TODO:
// 로그인 페이지 작업 후 로그인, 로그아웃, 유저 프로필 기능이 추가될 것입니다.
// 메인/홈페이지 작업 후 로고 링크 기능이 추가될 것입니다. 
// 검색 아이콘, 채팅 아이콘 링크 기능은 추후에 구현될 것입니다.
// 로고 이미지, 로고 텍스트, 검색창의 사이즈가 다듬어져야 합니다.
// 유저 프로필 클릭 시 나오는 드롭다운의 스타일이 다듬어져야 합니다.
// 헤더 전체 여기저기 들어가는 여백이 다듬어져야 합니다.
// 전역이나 헤더 자체에서의 w-[1920px]이 아닌 브라우저 사이즈에 따른 반응형 개선이 필요합니다.