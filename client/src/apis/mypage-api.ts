/*
 * File Name    : base-api.ts
 * Description  : base-api create
 * Author       : 김우현
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.13    김우현      Modified     type 지정
 */

import { api, baseApi } from './base-api';

// 사용자 프로필 가져오기
export async function fetchUserProfile() {
  const url = `${api.myPage}`;

  try {
    const response = await baseApi.get(url);
    console.log(response);
    return response.data;
  } catch (error: any) {
    console.error('Failed to fetch user profile:', error.response?.data?.message || error.message);
    return { error: error.response?.data?.message || 'Unknown error occurred' };
  }
}

// 사용자 프로필 업데이트하기
export async function updateUserProfile(profile: {
  imageUrl: string;
  nickName: string;
  name: string;
  email: string;
  hashtags: string[];
  created_At: string;
}) {
  const url = `${api.myPage}`;

  try {
    const response = await baseApi.put(url, profile);
    console.log(response);
    return response.data;
  } catch (error: any) {
    console.error('Failed to update user profile:', error.response?.data?.message || error.message);
    return { error: error.response?.data?.message || 'Unknown error occurred' };
  }
}

// 사용자 프로필 이미지 삭제하기
export async function deleteUserImage() {
  const url = `${api.myPage}/image`;

  try {
    const response = await baseApi.delete(url);
    return response.data;
  } catch (error: any) {
    console.error('Failed to delete user image:', error.response?.data?.message || error.message);
    return { error: error.response?.data?.message || 'Unknown error occurred' };
  }
}
