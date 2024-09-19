/*
 * File Name    : base-api.ts
 * Description  : base-api create
 * Author       : 김민지
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.10    김민지      Created      환경변수로 base-api 설정
 * 2024.09.19    김우현      Modified     type 지정
 */

import { api, baseApi } from './base-api';

export async function getAIChat() {
  const url = `${api.simulation}`;

  try {
    const response = await baseApi.get(url);
    console.log(response);
    return response.data;
  } catch (error: any) {
    console.error('Failed to update chat:', error.response?.data?.message || error.message);
    throw error;
  }
}

export async function getAIQuestion(category: string) {
  const url = `${api.simulation}/questions`; // 질문 데이터를 가져올 API 경로

  try {
    const response = await baseApi.get(url, {
      params: { category }, // 카테고리 파라미터로 전달
    });
    console.log(response); // 서버로부터 받은 응답을 로그로 출력
    return response.data; // 받은 데이터 반환
  } catch (error: any) {
    console.error('Failed to fetch question:', error.response?.data?.message || error.message);
    throw error; // 에러 발생 시 상위에서 처리할 수 있도록 던짐
  }
}

// export async function updateAIChat({})

// AI 채팅 데이터를 삭제하는 함수
export async function deleteAIChat(messageId: string) {
  const url = `${api.simulation}/${messageId}`; // AI 코치 페이지에서 삭제하는 부분이

  try {
    const response = await baseApi.delete(url);
    console.log(response); // 응답 확인용 로그
    return response.data; // 응답 데이터 반환
  } catch (error: any) {
    console.log('Failed to delete chat:', error.response?.data?.message || error.message);
    throw error;
  }
}
