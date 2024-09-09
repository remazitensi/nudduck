/**
 * File Name    : community.entity.ts
 * Description  : 커뮤니티 게시글 엔티티
 * Author       : 김재영
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.08    김재영      Created     커뮤니티 게시글 엔티티 초기 생성
 * 2024.09.09    김재영      Modified    게시글 속성 및 설명 추가
 */

import { Category } from '../enums/category.enum';

export class Community {
  post_id: number;
  title: string;
  content: string;
  user_id: number;
  category?: Category;
  created_at: Date;
  updated_at: Date;
  likes_count: number;
  views_count: number;
  comments_count: number;
}
