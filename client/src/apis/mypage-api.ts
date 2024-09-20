/*
 * File Name    : base-api.ts
 * Description  : base-api create
 * Author       : 김우현
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.13    김우현      Modified     type 지정
 * 2024.09.20    김우현      Updated     api 완성()
 */

import { isAxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { api, baseApi } from './base-api';

interface UserProfile {
  nickname: string; // 사용자 닉네임
  imageUrl: string; // 프로필 이미지 URL
  hashtags: string[]; // 해시태그 배열
}

// 사용자 프로필 가져오기
export async function fetchUserProfile() {
  const url = `${api.myPage}/my`; // 이 부분은 navigate를 사용하지 않음 왜냐면, 삭제랑 다르게 데이터를 가져오는 형식이라 페이지가 어디로 이동하는게 아니라 판단
  try {
    const response = await baseApi.get(url);
    response.status === 200; // 이건 조건 if 생략 따로 navigate할 게 아님 단순히 정보를 가져오는 것이라고 판단하여 if문 생략
  } catch (error: unknown) {
    // error는 any보다 isAxiosError가 어울리기에 import에서 isAxiosError를 해주었음
    if (isAxiosError(error)) {
      console.error('Failed to delete user account:', error.response?.data.message || error.message);
    } else {
      console.error('An unknown error occurred');
    }
    throw error;
  }
}

// 사용자 프로필 회원정보 수정
export async function updateUserProfile(
  profile: UserProfile,
  // 아래 string관련된 것들을 다 넣어야 하는건지? 예전에 했던거라 지우진 않음
) {
  const navigate = useNavigate();
  const url = `${api.myPage}/profile`;

  try {
    const response = await baseApi.put(url, profile);
    if (response.status === 200) {
      navigate(api.myPage);
    }
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error('Failed to update user profile:', error.response?.data.message || error.message);
    } else {
      console.error('An unknown error occurred');
    }
    throw error;
  }
}

// 계정 탈퇴  탈퇴기능만 있는 모달( 이 부분은 어느정도 이해했음)
// export async function deleteAccount() {
//   const url = `${api.myPage}/delete-account`
//   const navigate = useNavigate();

//   try {
//     const response = await baseApi.delete(url);

//     if(response.status === 200) {

//       navigate(api.home); // 삭제가 성공이 되면 홈페이지로 이동하게 끔 하는 것으로해석이 되어 navigate를 home으로 설정해 놓음
//     }
//   } catch (error: unknown) { // error는 any보다 isAxiosError가 어울리기에 import에서 isAxiosError를 해주었음
//     if(isAxiosError(error)) {
//       console.error('Failed to delete user account:', error.response?.data.message || error.message);
//     } else {
//       console.error('An unknown error occurred')
//     }
//     throw error;
//   }
// }

// 계정탈퇴 - 더미데이터 이용할 경우
export async function deleteAccount() {
  const url = `${api.myPage}/account`;
  console.log(url);
  const navigate = useNavigate();

  try {
    console.log('delete:', '요청');
    // // 백엔드와 연결하는 대신 더미 데이터를 이용
    // const mockResponse = {
    //   status: 200, // 성공시
    //   data: '탈퇴 처리 완료', // 더미 데이터
    // };

    // 실제 api 호출 대신 mockResponse를 사용하여 처리
    const response = await baseApi.delete(url, {}); // 빈객체 빈바디니까
    if (response.status === 200) {
      alert(response.data);
      navigate(api.home);
    }
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error('Failed to delete user account:', error.response?.data.message || error.message);
    } else {
      console.error('An unknown error occurred');
    }
    throw error;
  }
}
