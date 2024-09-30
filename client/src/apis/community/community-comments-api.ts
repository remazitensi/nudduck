/*
 * File Name    : community-reply-api.ts
 * Description  : 커뮤니티 댓글 관련 api
 * Author       : 김민지
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.20    김민지      Created     댓글 CRUD api 작성, 파일 이동
 */

import { CommentsResDto, CreateCommentDto } from '../../types/comments-type';
import { api, baseApi } from '../base-api';

// ------------- 댓글 api --------------------

// 댓글 목록 조회 (페이지네이션 포함)
export const getComments = async (postId: number, limit = 10, offset = 0): Promise<CommentsResDto> => {
  try {
    const response = await baseApi.get<CommentsResDto>(`${api.community}/articles/${postId}/comments/top-n`, {
      params: { limit, offset, sort: 'createdAt:asc' },
    });
    return response.data;
  } catch (error: any) {
    console.log('error', error.message);
    throw error;
  }
};

// 댓글 생성
export const createComment = async (postId: number, data: CreateCommentDto) => {
  try {
    const response = await baseApi.post<Comment>(`${api.community}/articles/${postId}/comments`, data);
    return response.data;
  } catch (error: any) {
    console.log('error', error.message);
    throw error;
  }
};

// 댓글 수정
export const updateComment = async (postId: number, commentId: number, data: UpdateCommentDto): Promise<Comment> => {
  const response = await baseApi.patch<Comment>(`/${postId}/comments/${commentId}`, data);
  return response.data;
};

// 댓글 삭제
export const deleteComment = async (postId: number, commentId: number): Promise<void> => {
  try {
    const response = await baseApi.delete(`${api.community}/articles/${postId}/comments/${commentId}`, {});
    console.log(response);
    if (response.status === 200) {
      alert('댓글이 삭제되었습니다 💣');
    }
  } catch (error: any) {
    console.log('error', error.message);
    return alert(error.message);
  }
};

// ------------- 대댓글 api --------------------

// 대댓글 조회
export const getReply = async (postId: number, parentId: number): Promise<CommentsResDto> => {
  try {
    const response = await baseApi.get(`${api.community}/articles/${postId}/comments/${parentId}/replies`);
    return response.data;
  } catch (error: any) {
    console.log('error', error.message);
    alert(error.message);
    throw error;
  }
};

// 대댓글 생성
export const createReply = async (postId: number, data: CreateCommentDto) => {
  try {
    const response = await baseApi.post<Comment>(`${api.community}/articles/${postId}/comments/${data.parentId}/replies`, data);
    return response.data;
  } catch (error: any) {
    console.log('error', error.message);
    throw error;
  }
};

// 대댓글 수정
export const updateReply = async (postId: number, commentId: number, data: UpdateCommentDto): Promise<Comment> => {
  const response = await baseApi.patch<Comment>(`/${postId}/comments/${commentId}/replies`, data);
  return response.data;
};

// 대댓글 삭제
export const deleteReply = async (postId: number, commentId: number): Promise<void> => {
  try {
    const response = await baseApi.delete(`${api.community}/articles/${postId}/comments/${commentId}/replies`, {});
    if (response.status === 204) {
      alert('댓글이 삭제되었습니다 💣');
    }
    return response;
  } catch (error: any) {
    console.log('error', error.message);
    return alert(error.message);
  }
};
