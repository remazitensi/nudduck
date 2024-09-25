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
 * 2024.09.22    황솜귤      Modified    드롭다운 디자인 수정 및 로그인 상태 확인 로직 변경
 * 2024.09.25    황솜귤      Modified    드롭다운 유저 정보를 이름에서 닉네임으로 변경
 */

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { baseApi } from '../apis/base-api'; // baseApi 임포트
import LoginModal from '../components/LoginModal';

const Header: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({
    nickname: '',
    email: '',
    profileImage: '',
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    fetchUserData(); // 컴포넌트가 처음 마운트될 때 사용자 정보 요청
  }, []);

  // 사용자 정보 요청 함수
  const fetchUserData = async () => {
    try {
      const response = await baseApi.get('/api/my'); // 로그인된 사용자 정보 가져오기
      if (response.status === 200) {
        const { nickname, email, imageUrl } = response.data;
        setUser({
          nickname,
          email,
          profileImage: imageUrl || 'https://via.placeholder.com/32x32', // 프로필 이미지가 없을 때 대체 이미지 사용
        });
        setIsLoggedIn(true); // 사용자 정보가 있으면 로그인 상태로 변경
      }
    } catch (error) {
      console.error('사용자 정보를 가져오는 데 실패했습니다:', error);
      setIsLoggedIn(false); // 오류 발생 시 로그인 상태를 false로 설정
    }
  };

  // 로그아웃 상태 변경 핸들러
  const handleLogoutClick = async () => {
    try {
      await baseApi.post('/api/my/logout'); // 서버에 로그아웃 요청
      localStorage.removeItem('refreshToken'); // 로컬 스토리지에서 리프레시 토큰 제거
      setIsLoggedIn(false);
      setUser({
        nickname: '',
        email: '',
        profileImage: '',
      });
      setDropdownOpen(false);

      // 로그아웃 후 '/'로 리다이렉트
      navigate('/');
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
        <Link to="/HomePage" className="flex items-center">
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
              <div className="text-sm font-semibold">{user.nickname}</div>
              {dropdownOpen && (
                <div className="absolute right-0 z-20 mt-2 flex w-[270px] items-center rounded-lg bg-white p-4 shadow-xl">
                  <img
                    src={user.profileImage}
                    alt="Profile"
                    className="h-[72px] w-[72px] rounded-full"
                  />
                  <div className="ml-4">
                    <div className="flex items-center">
                      <span className="text-[15px] font-semibold text-[#222222]">
                        {user.nickname}
                      </span>
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
          onLogin={fetchUserData} // 로그인 성공 시 사용자 정보 가져오기
          onClose={() => setIsModalOpen(false)} // 모달 닫기
        />
      )}
    </header>
  );
};

export default Header;
