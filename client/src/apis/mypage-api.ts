/*
 * File Name    : -api.ts
 * Description  : -api create
 * Author       : 김우현
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.13    김우현      Modified     type 지정
 * 2024.09.20    김우현      Updated     api 완성()
 *
 */

import { isAxiosError } from 'axios';
import { api, baseApi } from './base-api';

interface Post {
  id: number;
  title: string;
  date: string;
}

interface FavoriteLifeGraph {
  id: number;
  title: string;
  description: string;
}

interface UserProfile {
  id: string;
  nickname: string;
  imageUrl: string;
  name: string;
  email: string;
  createdAt: string;
  hashtags: string[];
  favoriteLifeGraph: FavoriteLifeGraph | null;
  posts: Post[];
  totalCount: number; // 전체 게시글 수
}

interface UpdateUserProfile {
  nickname: string;
  imageUrl: string;
  hashtags: string[];
}

// 사용자 프로필 가져오기
export async function fetchUserProfile(page: number = 1, limit: number = 10) {
  const url = `${api.myPage}?page=${page}&limit=${limit}`; // 페이지네이션 쿼리 추가
  try {
    const response = await baseApi.get<UserProfile>(url); // UserProfile 타입으로 데이터 반환
    if (response.status === 200) {
      return response.data; // 프로필 및 게시글 정보 반환
    }
  } catch (error: unknown) {
    if (isAxiosError(error)) {
    } else {
    }
    throw error;
  }
}

// 사용자 프로필 회원정보 수정
export async function updateUserProfile(profile: UpdateUserProfile): Promise<void> {
  const url = `${api.myPage}/profile`;

  try {
    const response = await baseApi.put(url, profile); // 프로필 수정 API 호출
    if (response.status === 200) {
    }
  } catch (error: unknown) {
    if (isAxiosError(error)) {
    } else {
    }
    throw error;
  }
}

// 계정탈퇴 API 호출
export async function deleteAccount(): Promise<void> {
  const url = `${api.myPage}/account`;

  try {
    const response = await baseApi.delete(url);
    if (response.status === 200) {
      alert('계정이 성공적으로 삭제되었습니다.');
    }
  } catch (error: unknown) {
    if (isAxiosError(error)) {
    } else {
    }
    throw error;
  }
}
