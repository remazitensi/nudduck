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
      console.log('Sim history:', response.data);
    }
    return response.data; // 데이터만 반환
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error('Failed to fetch Simulation History:', error.response?.data?.message || error.message);
    } else {
      console.error('An unknown error occurred');
    }
    throw error;
  }
}

export async function fetchIdSession(sessionId: number) {
  const url = `${api.simulation}/${sessionId}`;

  try {
    const response = await baseApi.get(url);
    if (response.status === 200) {
      console.log('Sim Id:', response.data);
    }
    return response.data; // 데이터만 반환
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error('Failed to Simulation Id:', error.response?.data?.message || error.message);
    } else {
      console.error('An unknown error occurred');
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
      console.log('Sim activation:', response.data);
    }
    return response.data; // sessionId만 반환
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error('Failed to Simulation Activation:', error.response?.data?.message || error.message);
    } else {
      console.error('An unknown error occurred');
    }
    throw error;
  }
}

// header AI코치 클릭시 불러오는 것 get, start-chat -post 동시 요청을 해야 함 start-chat
// export async function activateSimulation(): Promise<{ data: any }> {
//   const url = `${api.simulation}/start-chat`;
//   const body = { isNewChat: false }; // 서버로 보내는 body 값 (isNewChat: false)

//   try {
//     const response = await baseApi.post(url, body); // post요청에 body 값을 전달
//     if (response.status === 200) {
//       console.log('Sim activation:', response.data); // 채팅 활성화 응답 확인
//     } // 성공시 200
//     return response; // response 반환을 해야 Promise<{ data: any }> 에 빨간줄이 안그인다
//   } catch (error: unknown) {
//     if (isAxiosError(error)) {
//       console.error('Failed to Simulation Activation:', error.response?.data?.message || error.message);
//     } else {
//       console.error('An unknown error occurred');
//     }
//     throw error;
//   }
// }

// AI코치 헤더 버튼 클릭시 get, post 요청을 동시 진행
export async function startSimulation(isNew: boolean) {
  try {
    const [chatHistory, chatActivation] = await Promise.all([
      fetchSimulationHistory(), // 채팅 히스토리 get 요청
      activateSimulation(isNew), // 채팅 활성화 post 요청
    ]);

    console.log('Chat history:', chatHistory);
    console.log('Chat activation:', chatActivation);

    return { chatHistory, chatActivation };
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error('Failed to startSimulation:', error.response?.data?.message || error.message);
    } else {
      console.error('An unknown error occurred');
    }
    throw error;
  }
}

// 전송버튼 클릭 ask api post요청
export async function askSimulation(query: string, sessionId: number) {
  const url = `${api.simulation}/ask`;
  console.log('url:', url);
  const body = { query, sessionId };
  console.log('body:', body);
  try {
    const response = await baseApi.post(url, body);
    if (response.status === 200) {
      console.log('Sim ask:', response.data);
    }
    return response.data; // 응답 데이터 반환
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error('Failed to fetch Simulation ask:', error.response?.data?.message || error.message);
    } else {
      console.error('An unknown error occurred');
    }
    throw error;
  }
}

// 새 채팅 버튼 클릭시 api post요청
// export async function newSimulation(): Promise<{ data: any }> {
//   const url = `${api.simulation}/start-chat`;
//   try {
//     const response = await baseApi.post(url);
//     const body = { isNewChat: true }; // 서버로 보내는 body 값 (isNewChat: true)
//     // 이번에 body에 true를 넣어서 새채팅을 시작하도록 한다
//     if (response.status === 200) {
//       console.log('newSim Chat', response.data);
//     }
//     return response; // 마찬가지로 반환하여 Promise<{ data: any }> 에러를 막는다
//   } catch (error: unknown) {
//     if (isAxiosError(error)) {
//       console.error('Failed to new Sim chat:', error.response?.data?.message || error.message);
//     } else {
//       console.error('An unknown error occurred');
//     }
//     throw error;
//   }
// }

// 면접버튼 같은거 혹은 면접을 하고싶어 이런식으로 글을 쓰면 불러 와지는것 post

// AI 대화 채팅 기록도 post일듯 하다
