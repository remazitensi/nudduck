/*
 * File Name    : base-api.ts
 * Description  : base-api create
 * Author       : 김민지
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.10    김민지      Created      환경변수로 base-api 설정
 * 2024.09.19    김우현      Modified     type 지정
 * 2024.09.21    김우현      Modified     api 설정
 */

import { isAxiosError } from 'axios';
import { api, baseApi } from './base-api';

// header AI코치 클릭시 불러오는 것 get, start-chat -post 동시 요청을 해야 함
export async function fetchSimulationHistory() {
  const url = `${api.simulation}`;

  try {
    const response = await baseApi.get(url);
    if (response.status === 200) {
    }
    return response.data; // 데이터만 반환
  } catch (error: unknown) {
    if (isAxiosError(error)) {
    } else {
    }
    throw error;
  }
}

export async function fetchIdSession(sessionId: number) {
  const url = `${api.simulation}/${sessionId}`;

  try {
    const response = await baseApi.get(url);
    if (response.status === 200) {
    }
    return response.data; // 데이터만 반환
  } catch (error: unknown) {
    if (isAxiosError(error)) {
    } else {
    }
    throw error;
  }
}

// activateSimulation, newSimulation 2개 함수를 포함
export async function activateSimulation(isNew: boolean): Promise<{ sessionId: number }> {
  const url = `${api.simulation}/start-chat`;
  const body = { isNewChat: isNew }; // true일 때 새 채팅, false일 때 기존 채팅

  try {
    const response = await baseApi.post(url, body);
    if (response.status === 200) {
    }
    return response.data; // sessionId만 반환
  } catch (error: unknown) {
    if (isAxiosError(error)) {
    } else {
    }
    throw error;
  }
}

// AI코치 헤더 버튼 클릭시 get, post 요청을 동시 진행
export async function startSimulation(isNew: boolean) {
  try {
    const [chatHistory, chatActivation] = await Promise.all([
      fetchSimulationHistory(), // 채팅 히스토리 get 요청
      activateSimulation(isNew), // 채팅 활성화 post 요청
    ]);

    return { chatHistory, chatActivation };
  } catch (error: unknown) {
    if (isAxiosError(error)) {
    } else {
    }
    throw error;
  }
}

// 전송버튼 클릭 ask api post요청
export async function askSimulation(query: string, sessionId: number) {
  const url = `${api.simulation}/ask`;
  const body = { query, sessionId };
  try {
    const response = await baseApi.post(url, body);
    if (response.status === 200) {
    }
    return response.data; // 응답 데이터 반환
  } catch (error: unknown) {
    if (isAxiosError(error)) {
    } else {
    }
    throw error;
  }
}

// 특정 세션 삭제 API
export async function deleteSession(sessionId: number) {
  const url = `${api.simulation}/${sessionId}`;

  try {
    const response = await baseApi.delete(url);
    if (response.status === 200) {
    }
    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
    } else {
    }
    throw error;
  }
}
