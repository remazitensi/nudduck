/**
 * File Name    : community-type.tsx
 * Description  : 커뮤니티 기능 type 명시
 * Author       : 김민지
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.12    김민지      Created     PostList, PostDetail 명시
 * 2024.09.18    김민지      Modified    타입명 변경 (Params 붙임)
 * 2024.09.19    김민지      Modified    PostTitleData, PostDetailData 명시
 */

export type PostListParams = { category?: string; page: number; sort?: string };

export type PostDetailParams = { category?: string; id: string };

export type PostTitleData = {
  postId: number;
  title: string;
  category: string;
  userId: number;
  createdAt: string;
  viewCount: number;
  nickname: string;
  imageUrl: string;
};

export type PostDetailData = {
  postId: number;
  title: string;
  viewCount: number;
  createdAt: string;
  category: string;
  imageUrl: string;
  userId: number;
  nickname: string;
};

export type PostListRes = {
  totalItems: number;
  currentPage: number;
  totalPages: number;
  community: PostTitleData[]; // 게시물 리스트
};

export type PostBodyData = {
  title: string;
  content: string;
  category: string;
};
