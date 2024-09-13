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
 */

// 로그인 성공 후 필요한 페이지로 리다이렉트하는 함수 추가
import React from 'react';
import './LoginModal.css';

interface LoginModalProps {
  onClose: () => void;
  onLogin: () => void; // 로그인 성공 시 호출
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onLogin }) => {
  const handleGoogleLogin = () => {
    window.location.href = '/auth/google';
    onLogin();  // 로그인 성공 시 호출
  };

  const handleKakaoLogin = () => {
    window.location.href = '/auth/kakao';
    onLogin();  // 로그인 성공 시 호출
  };

  return (
    <div className="login-modal">
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          <img src="/login-modal-close.png" alt="닫기" />
        </button>
        <h2 className="modal-title">로그인/회원가입</h2>
        <p className="modal-description">
          누워서 떡 먹기처럼 쉬운 면접 준비, <span className="highlight">누떡</span>이 도와줄게!<br/>
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
          로그인 및 회원가입 시 해당 웹 서비스의 이용약관과<br/>
          개인정보 수집 및 이용에 동의한 것으로 간주합니다.
        </p>
      </div>
    </div>
  );
};

export default LoginModal;
