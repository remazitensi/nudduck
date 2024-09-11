/*
 * File Name    : base-api.ts
 * Description  : base-api create
 * Author       : 김민지
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.10    김민지      Created      환경변수로 base-api 설정
 */

import axios from 'axios';

export const api = {
  home: '/home',
  myPage: '/my',
  simulation: '/simulation',
  community: '/community',
  expert: '/expert',
  lifeGraph: '/life-graph',
  chat: '/chat',
};

export const baseApi = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 5000,
});
