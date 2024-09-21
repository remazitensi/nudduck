/*
 * File Name    : community-api.ts
 * Description  : community-api create
 * Author       : 김민지
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.10    김민지      Created      환경변수로 base-api 설정
 * 2024.09.13    김민지      Modified     게시글 get api 추가, 경로 수정
 * 2024.09.19    김민지      Modified     타입 지정, 카테고리별 api 개별 작성, 주석 정리
 */

import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { PostBodyData, PostDetailData, PostListParams } from '../types/community-type';
import { api, baseApi } from './base-api';

// <------------------ 게시글 api ------------------>

// 에러를 확인하는 함수
function isAxiosError(error: unknown): error is AxiosError {
  return (error as AxiosError).isAxiosError !== undefined;
}

// 전체 게시글 목록 get 요청
export async function getPostList({ page = 1, sort = 'latest' }: PostListParams) {
  // 카테고리가 있으면 /community/{category}, 없으면 /community
  // 리팩토링 이후 카테고리 선택 시 setCategory가 잘 동작하면 주석 해제할 예정
  // const url = category ? `${api.community}/${category}` : api.community;

  const url = api.community;
  try {
    // get 요청으로 받은 응답을 response에 저장
    const response = await baseApi.get(url, {
      params: {
        page: Number(page),
        pageSize: Number(10),
        // sort: sort,
      },
    });
    console.log(response);
    return response.data; // 성공 시 data 반환
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error('Failed to fetch posts:', error.response?.data.message);
    } else {
      console.error('알 수 없는 에러가 발생했습니다.');
    }
    throw error;
  }
}

// 면접 카테고리 게시글 목록 조회
export async function getInterviewPostList({ page = 1, sort = 'latest' }: PostListParams) {
  const url = `${api.community}/interview`;
  try {
    const response = await baseApi.get(url, {
      params: {
        page: page,
        pageSize: 10,
        sort: sort,
      },
    });
    console.log(response);
    return response.data; // 성공 시 data 반환
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error('Failed to fetch posts:', error.response?.data.message);
    } else {
      console.error('알 수 없는 에러가 발생했습니다.');
    }
    throw error;
  }
}

// 모임 카테고리 게시글 목록 조회
export async function getMeetingPostList({ page = 1, sort = 'latest' }: PostListParams) {
  const url = `${api.community}/meeting`;
  try {
    const response = await baseApi.get(url, {
      params: {
        page: page,
        pageSize: 10,
        sort: sort,
      },
    });
    console.log(response);
    return response.data; // 성공 시 data 반환
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error('Failed to fetch posts:', error.response?.data.message);
    } else {
      console.error('알 수 없는 에러가 발생했습니다.');
    }
    throw error;
  }
}

// 스터디 카테고리 게시글 목록 조회
export async function getStudyPostList({ page = 1, sort = 'latest' }: PostListParams) {
  const url = `${api.community}/study`;
  try {
    const response = await baseApi.get(url, {
      params: {
        page: page,
        pageSize: 10,
        sort: sort,
      },
    });
    console.log(response);
    return response.data; // 성공 시 data 반환
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error('Failed to fetch posts:', error.response?.data.message);
    } else {
      console.error('알 수 없는 에러가 발생했습니다.');
    }
    throw error;
  }
}

// 잡담 카테고리 게시글 목록 조회
export async function getTalkPostList({ page = 1, sort = 'latest' }: PostListParams) {
  const url = `${api.community}/talk`;
  try {
    const response = await baseApi.get(url, {
      params: {
        page: page,
        pageSize: 10,
        sort: sort,
      },
    });
    console.log(response);
    return response.data; // 성공 시 data 반환
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error('Failed to fetch posts:', error.response?.data.message);
    } else {
      console.error('알 수 없는 에러가 발생했습니다.');
    }
    throw error;
  }
}

// 카테고리 무관 게시글 상세 내역 get 요청
export async function getPostDetail(id: number) {
  try {
    const response = await baseApi.get(`${api.community}/${id}`, {});
    console.log(response);
    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error('Failed to fetch posts:', error.response?.data.message);
    } else {
      console.error('알 수 없는 에러가 발생했습니다.');
    }
    throw error;
  }
}

// 게시글 작성 post 요청
export async function createPost({ post }: { post: PostBodyData }) {
  const navigate = useNavigate();
  try {
    // baseApi(url, { 백으로 보내야 할 정보를 담는 곳 })
    const response = await baseApi.post(api.community, { post });

    if (response.status === 201) {
      // 커뮤니티 페이지로 이동
      navigate(`/community`);
    }
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error('Failed to create posts:', error.response?.data.message);
    } else {
      console.error('알 수 없는 에러가 발생했습니다.');
    }
    throw error;
  }
}

// 게시글 수정 put 요청
export async function editPost({ post }: { post: PostDetailData }) {
  const navigate = useNavigate();
  try {
    const response = await baseApi.put(`${api.community}/${post.postId}`, {});

    if (response.status === 201) {
      // 수정한 게시글 페이지로 이동
      navigate(`/community/${post.postId}`);
    }
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error('Failed to edit posts:', error.response?.data.message);
    } else {
      console.error('알 수 없는 에러가 발생했습니다.');
    }
    throw error;
  }
}

// 게시글 삭제 delete 요청
export async function deletePost({ post }: { post: PostDetailData }) {
  const navigate = useNavigate();
  try {
    const response = await baseApi.delete(`${api.community}/${post.postId}`, {});

    if (response.status === 201) {
      navigate(api.myPage);
    }
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error('Failed to delete posts:', error.response?.data.message);
    } else {
      console.error('알 수 없는 에러가 발생했습니다.');
    }
    throw error;
  }
}

// <-------------- 댓글 ------------------>

//TODO: 댓글 api 추가
