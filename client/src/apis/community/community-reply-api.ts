/*
 * File Name    : community-reply-api.ts
 * Description  : 커뮤니티 댓글 관련 api
 * Author       : 김민지
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.20    김민지      Created     댓글 CRUD api 작성, 파일 이동
 */

import { CommentsDto, CreateCommentDto } from '../../types/commets-type';
import { api, baseApi } from '../base-api';

// 댓글 목록 조회 (페이지네이션 포함)
export const getComments = async (postId: number, limit = 10, offset = 0): Promise<CommentsDto[]> => {
  try {
    const response = await baseApi.get<CommentsDto[]>(`${api.community}/article/${postId}/comments/root`, {
      params: { limit, offset },
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
    const response = await baseApi.post<Comment>(`${api.community}/article/${postId}/comments`, data);
    return response.data;
  } catch (error) {
    console.log(error.message);
  }
};

// 댓글 수정
export const updateComment = async (postId: number, commentId: number, data: UpdateCommentDto): Promise<Comment> => {
  const response = await baseApi.patch<Comment>(`/${postId}/comments/${commentId}`, data);
  return response.data;
};

// 댓글 삭제
export const deleteComment = async (postId: number, commentId: number): Promise<void> => {
  await baseApi.delete(`/${postId}/comments/${commentId}`);
};

// 대댓글 생성
export const createReply = async (postId: number, parentId: number, data: CreateCommentDto): Promise<Comment> => {
  const response = await baseApi.post<Comment>(`/${postId}/comments/${parentId}/replies`, data);
  return response.data;
};

// 대댓글 수정
export const updateReply = async (postId: number, commentId: number, data: UpdateCommentDto): Promise<Comment> => {
  const response = await baseApi.patch<Comment>(`/${postId}/comments/${commentId}/replies`, data);
  return response.data;
};

// 대댓글 삭제
export const deleteReply = async (postId: number, commentId: number): Promise<void> => {
  await baseApi.delete(`/${postId}/comments/${commentId}/replies`);
};
