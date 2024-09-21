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
 * 2024.09.21    황솜귤      Modified    로고 클릭 시 Link to
 * 2024.09.21    황솜귤      Modified    로그인/로그아웃 상태에 따른 UI 변경 및 메뉴 노출 제어
 * 2024.09.22    황솜귤      Modified    드롭다운 디자인 수정 및 정렬
 */

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { baseApi } from '../apis/base-api'; // baseApi 임포트
import LoginModal from '../components/LoginModal';

const Header: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({
    name: '',
    email: '',
    profileImage: '',
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      fetchUserData();
    }
  }, [isLoggedIn]);

  // 사용자 정보 요청 함수
  const fetchUserData = async () => {
    try {
      const response = await baseApi.get('/api/my'); // API 요청으로 사용자 정보 가져오기
      const { name, email, imageUrl } = response.data; // 필요한 정보 추출
      setUser({
        name,
        email,
        profileImage: imageUrl || 'https://via.placeholder.com/32x32', // 프로필 이미지가 없을 때 대체 이미지 사용
      });
    } catch (error) {
      console.error('사용자 정보를 가져오는 데 실패했습니다:', error);
    }
  };

  // 로그인 상태 변경 핸들러
  const handleLogin = async () => {
    try {
      const response = await baseApi.get('/auth/status'); // 실제로 로그인 상태를 확인
      if (response.status === 200) {
        setIsLoggedIn(true);
        setIsModalOpen(false); // 로그인 모달 닫기
      }
    } catch (error) {
      console.error('로그인 상태 확인에 실패했습니다.', error);
    }
  };

  // 로그아웃 상태 변경 핸들러
  const handleLogoutClick = async () => {
    try {
      await baseApi.post('/api/my/logout'); // 서버에 로그아웃 요청
      localStorage.removeItem('refreshToken'); // 로컬 스토리지에서 리프레시 토큰 제거
      setIsLoggedIn(false);
      setUser({
        name: '',
        email: '',
        profileImage: '',
      });
      setDropdownOpen(false);
    } catch (error) {
      console.error('로그아웃에 실패했습니다.', error);
    }
  };

  const handleProfileClick = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // 로그인 또는 회원가입 버튼 클릭 시 모달 열기
  const openLoginModal = () => {
    setIsModalOpen(true);
  };

  return (
    <header className="w-full bg-white shadow-md">
      <div className="container mx-auto flex items-center justify-between px-8 py-4">
        {/* 로고 및 사이트명 */}
        <Link to="/" className="flex items-center">
          <img src="/logo.png" className="mr-4 h-[66px] w-[66px]" alt="Nudduck Logo" />
          <span className="text-4xl font-bold text-gray-800">NUDDUCK</span>
        </Link>

        {/* 로그인 후에만 메뉴 표시 */}
        {isLoggedIn && (
          <nav className="flex space-x-8">
            <Link to="/AICoach" className="hover:text-[#909700]">
              AI 코치
            </Link>
            <Link to="/ExpertsPage" className="hover:text-[#909700]">
              전문가 상담
            </Link>
            <Link to="/community" className="hover:text-[#909700]">
              커뮤니티
            </Link>
            <Link to="/LifeGraphDetail" className="hover:text-[#909700]">
              인생 그래프
            </Link>
          </nav>
        )}

        {/* 로그인 여부에 따른 사용자 정보 표시 */}
        <div className="flex items-center space-x-4">
          {!isLoggedIn ? (
            <div className="space-x-2">
              <button onClick={openLoginModal} className="hover:underline">
                로그인
              </button>
              <span>|</span>
              <button onClick={openLoginModal} className="hover:underline">
                회원가입
              </button>
            </div>
          ) : (
            <div className="relative" onClick={handleProfileClick}>
              <img
                src={user.profileImage}
                alt="Profile"
                className="h-8 w-8 cursor-pointer rounded-full"
              />
              <div className="text-sm font-semibold">{user.name}</div>
              {dropdownOpen && (
                <div className="absolute right-0 z-20 mt-2 flex w-[270px] items-center rounded-lg bg-white p-4 shadow-xl">
                  <img
                    src={user.profileImage}
                    alt="Profile"
                    className="h-[72px] w-[72px] rounded-full"
                  />
                  <div className="ml-4">
                    <div className="flex items-center">
                      <span className="text-[15px] font-semibold text-[#222222]">{user.name}</span>
                      <span className="ml-1 text-[15px] font-normal text-[#555555]">님</span>
                    </div>
                    <div className="text-[13px] text-[#555555]">{user.email}</div>
                    <div className="mt-1 flex items-center space-x-2 text-[13px] text-[#333333]">
                      <Link to="/mypage" className="hover:underline">
                        마이페이지
                      </Link>
                      <span className="text-[#888888]">|</span>
                      <button onClick={handleLogoutClick} className="hover:underline">
                        로그아웃
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 로그인 모달 */}
      {isModalOpen && (
        <LoginModal
          onLogin={handleLogin} // 로그인 성공 시 호출
          onClose={() => setIsModalOpen(false)} // 모달 닫기
        />
      )}
    </header>
  );
};

export default Header;
