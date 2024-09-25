/*
 * File Name    : base-api.ts
 * Description  : base-api create
 * Author       : 김민지
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.10    김민지      Created      환경변수로 base-api 설정
 * 2024.09.11    김민지      Modified     baseApi 옵션 추가, import qs
 * 2024.09.24    김민지      Modified     baseApi 변수명 수정, 엑세스토큰 인터셉터
 */

import axios from 'axios';
import qs from 'qs';

export const api = {
  auth: '/auth',
  home: '/home',
  myPage: '/my',
  simulation: '/simulation',
  community: '/community',
  expert: '/expert',
  lifeGraph: '/life-graph',
  chat: '/chat',
};

export const baseApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Vite 환경 변수로 설정된 URL
  // timeout: 5000, // 5초 후 타임아웃
  withCredentials: true, // 자격 증명 포함
  paramsSerializer: (parameters) => qs.stringify(parameters, { arrayFormat: 'repeat', encode: false }), // 쿼리파라미터 직렬화
});

baseApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      console.log(error);
      originalRequest._retry = true;
      try {
        // 엑세스 토큰 재발급 요청
        await baseApi.post('/auth/access-token');
        // 새로운 엑세스 토큰으로 요청 재시도
        return baseApi(originalRequest);
      } catch (err) {
        alert('로그인이 필요합니다 😎');
        window.location.href = 'http://localhost:5173/';
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  },
);
