/*
 * File Name    : base-api.ts
 * Description  : base-api create
 * Author       : 김민지
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.10    김민지      Created      환경변수로 base-api 설정
 */

import { useLocation } from 'react-router-dom';
import { api, baseApi } from './base-api';

export function getPostList(category = '', page = 1, sort = 'latest', success, fail) {
  // 카테고리가 있으면 /community/{category}, 없으면 /community
  const url = category ? `${api.community}${category}` : api.community;

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

export function getPostDetail(id: string) {
  const location = useLocation();

  // pathname
  const url = location.pathname;

  return baseApi
    .get(url`${id}`, {})
    .then(success)
    .catch(fail);
}

// export function get
