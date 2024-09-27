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

import { useLocation } from 'react-router-dom';
import { api, baseApi } from './base-api';

// 게시글 리스트 get 요청
// props
export function getPostList(category = '', page = 1, sort = 'latest', success: any, fail: any) {
  // 카테고리가 있으면 /community/{category}, 없으면 /community
  const url = category ? `${api.community}/${category}` : api.community;

  return baseApi
    .get(url, {
      params: {
        page: page,
        sort: sort,
      },
    })
    .then(success)
    .catch(fail);
}

// 게시글 상세 내역 get 요청
export function getPostDetail({ id, success, fail }: { id: string; success: any; fail: any }) {
  const location = useLocation();

  // pathname
  const url = location.pathname;

  return baseApi.get(`${url}/${id}`, {}).then(success).catch(fail);
}

//TODO: 검색, 댓글 api 추가
