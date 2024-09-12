/*
 * File Name    : base-api.ts
 * Description  : base-api create
 * Author       : 김민지
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.10    김민지      Created      환경변수로 base-api 설정
 * 2024.09.12    김민지      Modified     type 지정
 */

import { postDetail, postList } from '../types/community-type';
import { api, baseApi } from './base-api';

// <------------------ 게시글 api ------------------>

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
    throw error; // 실패 시 error를 throw
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
    throw error;
  }
}

// <-------------- 댓글 ------------------>

//TODO: 댓글 api 추가
