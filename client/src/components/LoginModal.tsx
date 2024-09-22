/**
 * File Name    : LoginModal.tsx
 * Description  : 로그인 및 회원가입을 위한 모달 컴포넌트
 * Author       : 황솜귤
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.11    황솜귤      Created     로그인 모달 컴포넌트 생성
 * 2024.09.11    황솜귤      Modified    onLogin 핸들러 추가
 * 2024.09.12    황솜귤      Modified    파일명 수정
 * 2024.09.21    황솜귤      Modified    baseApi로 수정
 * 2024.09.22    황솜귤      Modified    로그인 콜백을 통한 리디렉션 처리
 */

import axios from 'axios';
import React from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate 추가
import './LoginModal.css';

interface LoginModalProps {
  onClose: () => void;
  onLogin: () => void; // 로그인 성공 시 호출
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onLogin }) => {
  const navigate = useNavigate(); // navigate hook 사용

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:3000/api/auth/google'; // Google 소셜 로그인 URL로 이동
  };

  const handleKakaoLogin = () => {
    window.location.href = 'http://localhost:3000/api/auth/kakao'; // Kakao 소셜 로그인 URL로 이동
  };

  const handleAuthCallback = async () => {
    try {
      // axios를 통해 인증된 사용자의 정보를 가져옵니다.
      const response = await axios.get('http://localhost:3000/api/my', { withCredentials: true });
      if (response.status === 200) {
        onLogin(); // 로그인 상태 업데이트
        navigate('/HomePage'); // 로그인 성공 시 HomePage로 리디렉트
        onClose(); // 로그인 모달 닫기
      }
    } catch (error) {
      console.error('로그인 처리 중 오류 발생:', error);
    }
  };

  React.useEffect(() => {
    const currentUrl = window.location.href;
    if (
      currentUrl.includes('/auth/google/callback') ||
      currentUrl.includes('/auth/kakao/callback')
    ) {
      handleAuthCallback();
    }
  }, []);

  return (
    <div className="login-modal">
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          <img src="/login-modal-close.png" alt="닫기" />
        </button>
        <h2 className="modal-title">로그인/회원가입</h2>
        <p className="modal-description">
          누워서 떡 먹기처럼 쉬운 면접 준비, <span className="highlight">누떡</span>이 도와줄게!
          <br />
          로그인하고 AI 코치와 면접 대비하기
        </p>
        <button className="login-button google-login" onClick={handleGoogleLogin}>
          <img src="/google-login.png" alt="구글 로그인" />
          구글 로그인/회원가입
        </button>
        <button className="login-button kakao-login" onClick={handleKakaoLogin}>
          <img src="/kakao-login.png" alt="카카오 로그인" />
          카카오 로그인/회원가입
        </button>
        <p className="login-info">
          로그인 및 회원가입 시 해당 웹 서비스의 이용약관과
          <br />
          개인정보 수집 및 이용에 동의한 것으로 간주합니다.
        </p>
      </div>
    </div>
  );
};

export default LoginModal;
