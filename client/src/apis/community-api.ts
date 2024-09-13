/*
 * File Name    : community-api.ts
 * Description  : community-api create
 * Author       : 김민지
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.10    김민지      Created      환경변수로 base-api 설정
 * 2024.09.13    김민지      Modified     게시글 get api 추가, 경로 수정
 */

import { postDetail, postList } from '../types/community-type';
import { api, baseApi } from './base-api';

// <------------------ 게시글 api ------------------>

// import 한 테스트 데이터
// const testPost = {
//   post_id: 5,
//   title: '제목입니다울랄라',
//   content: '내용입니다.',
//   user_id: '1004',
//   category: 'study',
//   created_at: '2024-09-12T12:34:56.789Z',
//   updated_at: '2024-09-12T12:34:56.789Z',
//   likes_count: 10,
//   views_count: 100,
//   comments_count: 5,
// };

// 게시글 리스트 get 요청
export async function getPostList({ category = '', page = 1, sort = 'latest', search = '' }: postList): Promise<any> {
  // 카테고리가 있으면 /community/{category}, 없으면 /community
  const url = category ? `${api.community}/${category}` : api.community;
  try {
    // get 요청으로 받은 응답을 response에 저장
    const response = await baseApi.get(url, {
      params: {
        page: page,
        sort: sort,
        search: search,
      },
    });
    console.log(response);
    return response.data; // 성공 시 data 반환
  } catch (error) {
    return console.error('Failed to fetch posts:', error.response.data.message); // 실패 시 error message
  }
}

// 게시글 상세 내역 get 요청
export async function getPostDetail({ category = '', id = '' }: postDetail): Promise<any> {
  // 카테고리가 있으면 /community/{category}, 없으면 /community
  const url = category ? `${api.community}/${category}` : api.community;
  try {
    const response = await baseApi.get(`${url}/${id}`, {});
    console.log(response);
    return response.data;
  } catch (error) {
    return console.error('Failed to fetch posts:', error.response.data.message); // 실패 시 error message
  }
}

// 게시글 작성 post 요청
export async function writePost({ post }) {
  try {
    // baseApi(url, { 백으로 보내야 할 정보를 담는 곳 })
    const response = await baseApi.post(api.community, { post });

    if (response.status === 201) {
      window.location.href = `/community/${post.post_id}`;
    }
  } catch (error) {
    return console.error('Failed to fetch posts:', error.response.data.message); // 실패 시 error message
  }
}

// 게시글 수정 put 요청
export async function editPost({ post }) {
  try {
    const response = await baseApi.put(`${api.community}/${post.post_id}`, {});

    if (response.status === 201) {
      window.location.href = `api.community/${post.post_id}`;
    }
  } catch (error) {
    return console.error('Failed to fetch posts:', error.response.data.message); // 실패 시 error message
  }
}

// 게시글 삭제 delete 요청
export async function deletePost({ post }) {
  try {
    const response = await baseApi.delete(`${api.community}/${post.post_id}`, {});

    if (response.status === 201) {
      window.location.href = `api.community`;
    }
  } catch (error) {
    return console.error('Failed to fetch posts:', error.response.data.message); // 실패 시 error message
  }
}

// TODO : 게시글 좋아요 증가

// TODO : 게시글 좋아요 감소

// TODO : 게시글 조회수 증가

// <-------------- 댓글 ------------------>

//TODO: 댓글 api 추가
