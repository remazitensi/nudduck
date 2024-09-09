/**
 * File Name    : community.service.ts
 * Description  : 커뮤니티 서비스
 * Author       : 김재영
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.07    김재영      Created     커뮤니티 서비스 초기 생성
 * 2024.09.09    김재영      Modified    게시글 CRUD 메서드 구현
 */

import { Injectable, Logger } from '@nestjs/common';
import { Community } from './entities/community.entity';
import { Category } from './enums/category.enum'; // enum import

@Injectable()
export class CommunityService {
  private readonly logger = new Logger(CommunityService.name);
  private communities: Community[] = []; // Mock 데이터 저장소
  private idCounter = 1; // ID 카운터

  // 전체 게시글 조회
  async findAll(): Promise<Community[]> {
    this.logger.log('Fetching all posts');
    return this.communities;
  }

  // 특정 게시글 조회
  async findOne(id: number): Promise<Community | null> {
    this.logger.log(`Fetching post with id ${id}`);
    return this.communities.find((post) => post.post_id === id) || null;
  }

  // 카테고리별 게시글 조회
  async findByCategory(category: Category): Promise<Community[]> {
    this.logger.log(`Searching for posts in category ${category}`);
    return this.communities.filter((post) => post.category === category);
  }

  // 게시글 생성
  async create(createCommunityDto: any): Promise<Community> {
    const newPost: Community = {
      post_id: this.idCounter++, // ID 자동 증가
      ...createCommunityDto,
      created_at: new Date(), // 생성 날짜
      updated_at: new Date(), // 수정 날짜
      likes_count: 0, // 초기 좋아요 수
      views_count: 0, // 초기 조회 수
      comments_count: 0, // 초기 댓글 수
    };
    this.logger.log(`Creating new post: ${JSON.stringify(newPost)}`);
    this.communities.push(newPost);
    return newPost;
  }

  // 게시글 수정
  async update(id: number, updateCommunityDto: any): Promise<Community | null> {
    const index = this.communities.findIndex((post) => post.post_id === id);
    if (index === -1) {
      this.logger.error(`Post with id ${id} not found for update`);
      return null;
    }
    const updatedPost = { ...this.communities[index], ...updateCommunityDto };
    this.logger.log(`Updating post with id ${id}: ${JSON.stringify(updatedPost)}`);
    this.communities[index] = updatedPost;
    return updatedPost;
  }

  // 게시글 삭제
  async remove(id: number): Promise<void> {
    const exists = this.communities.some((post) => post.post_id === id);
    if (!exists) {
      this.logger.error(`Post with id ${id} not found for deletion`);
      return;
    }
    this.communities = this.communities.filter((post) => post.post_id !== id);
    this.logger.log(`Deleted post with id ${id}`);
  }
}
