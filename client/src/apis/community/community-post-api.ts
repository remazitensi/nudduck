/*
 * File Name    : community-post-api.ts
 * Description  : 커뮤니티 게시글 관련 api
 * Author       : 김민지
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.10    김민지      Created      환경변수로 base-api 설정
 * 2024.09.13    김민지      Modified     게시글 get api 추가, 경로 수정
 * 2024.09.19    김민지      Modified     타입 지정, 카테고리별 api 개별 작성, 주석 정리
 * 2024.09.21    김민지      Modified     sort 변경, 댓글/게시글 api 분리, 린터 경고 해결, 파일 이동
 */

import { AxiosError } from 'axios';
import { PostBodyData, PostListParams } from '../../types/community-type';
import { api, baseApi } from '../base-api';
// const navigate = useNavigate();

// <------------------ 게시글 api ------------------>

// 에러를 확인하는 함수
function isAxiosError(error: unknown): error is AxiosError {
  return (error as AxiosError).isAxiosError !== undefined;
}

// 전체 게시글 목록 get 요청
export async function getPostList({ page, sort, category }: PostListParams) {
  const url = `${api.community}/${category}`;
  try {
    // get 요청으로 받은 응답을 response에 저장
    const response = await baseApi.get(url, {
      params: {
        page: Number(page),
        pageSize: Number(10),
        sort: sort,
      },
    });
    return response.data; // 성공 시 data 반환
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      const errorMessage = (error.response?.data as { message: string })?.message;
      console.error('Failed to fetch posts:', errorMessage);
      alert(errorMessage);
    } else {
      console.error('알 수 없는 에러가 발생했습니다.');
    }
    throw error;
  }
}

// 카테고리 무관 게시글 상세 내역 get 요청
export async function getPostDetail(id: number) {
  try {
    const response = await baseApi.get(`${api.community}/articles/${id}`, {});
    console.log(response);
    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      const errorMessage = (error.response?.data as { message: string })?.message;
      console.error('Failed to fetch posts:', errorMessage);
    } else {
      console.error('알 수 없는 에러가 발생했습니다.');
    }
    throw error;
  }
}

// 게시글 작성 post 요청
export async function createPost(post: PostBodyData) {
  try {
    const response = await baseApi.post(api.community, post);
    if (response.status === 201) {
      // 게시글이 성공적으로 생성된 경우
      return response.data;
    }
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      const errorMessage = (error.response?.data as { message: string })?.message;
      console.error('Failed to create post:', errorMessage);
      throw new Error(errorMessage); // 에러 메시지를 상위로 던짐
    } else {
      console.error('알 수 없는 에러가 발생했습니다.');
      throw new Error('알 수 없는 에러가 발생했습니다.');
    }
  }
}

//  게시글 수정 put 요청
export async function editPost(post: PostBodyData, id: number) {
  try {
    const response = await baseApi.put(`${api.community}/articles/${id}`, post);

    if (response.status === 201) {
      // 게시글이 성공적으로 생성된 경우
      return response.data;
    }
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      const errorMessage = (error.response?.data as { message: string })?.message;
      console.error('Failed to create post:', errorMessage);
      throw new Error(errorMessage); // 에러 메시지를 상위로 던짐
    } else {
      console.error('알 수 없는 에러가 발생했습니다.');
      throw new Error('알 수 없는 에러가 발생했습니다.');
    }
  }
}

//  게시글 삭제 delete 요청
export async function deletePost(id: number) {
  try {
    const response = await baseApi.delete(`${api.community}/articles/${id}`, {});
    if (response.status === 200) {
      alert('게시글이 삭제되었습니다 💣');
    }
  } catch (error: any) {
    console.log('error', error.message);
    return alert(error.message);
  }
}

// 다른 유저의 프로필 조회
export async function getUserProfile(userId: number) {
  const url = `/profile/${userId}`;
  console.log(url);
  try {
    const response = await baseApi.get(url);
    console.log(response);
    return response.data; // 성공 시 data 반환
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      const errorMessage = (error.response?.data as { message: string })?.message;
      console.error('Failed to fetch user profile:', errorMessage);
    } else {
      console.error('알 수 없는 에러가 발생했습니다.');
    }
    throw error;
  }
}
