/**
 * File Name    : community.service.ts
 * Description  : 커뮤니티 서비스
 * Author       : 김재영
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.07    김재영      Created     커뮤니티 서비스 초기 생성
 * 2024.09.09    김재영      Modified    게시글 CRUD 메서드 구현
 * 2024.09.10    김재영      Modified    댓글 관련 API 메서드 추가
 */
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Community } from './entities/community.entity';
import { Comment } from './entities/comment.entity';
import { Category } from './enums/category.enum'; // enum import

@Injectable()
export class CommunityService {
  private readonly logger = new Logger(CommunityService.name);
  private communities: Community[] = []; // Mock 데이터 저장소
  private comments: Comment[] = []; // Mock 댓글 저장소
  private postIdCounter = 1; // 게시글 ID 카운터
  private commentIdCounter = 1; // 댓글 ID 카운터

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

  // 카테고리와 ID로 게시글 조회
  async findByIdAndCategory(id: number, category: Category): Promise<Community | null> {
    this.logger.log(`Fetching post with id ${id} in category ${category}`);
    return this.communities.find((post) => post.post_id === id && post.category === category) || null;
  }

  // 게시글 생성
  async create(createCommunityDto: any): Promise<Community> {
    const newPost: Community = {
      post_id: this.postIdCounter++, // ID 자동 증가
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
    const updatedPost = { ...this.communities[index], ...updateCommunityDto, updated_at: new Date() };
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

  // 댓글 작성
  async addComment(postId: number, createCommentDto: any): Promise<Comment> {
    const post = await this.findOne(postId);
    if (!post) {
      this.logger.error(`Post with id ${postId} not found for adding comment`);
      throw new NotFoundException(`게시글 ${postId}를 찾을 수 없습니다.`);
    }

    const newComment: Comment = {
      comment_id: this.commentIdCounter++, // 댓글 ID 자동 증가
      ...createCommentDto,
      post_id: postId,
      created_at: new Date(),
      updated_at: new Date(),
    };

    this.logger.log(`Adding new comment: ${JSON.stringify(newComment)}`);
    this.comments.push(newComment);

    // 게시글의 댓글 수 업데이트
    post.comments_count++;
    return newComment;
  }

  // 댓글 수정
  async updateComment(postId: number, commentId: number, updateCommentDto: any): Promise<Comment | null> {
    const commentIndex = this.comments.findIndex((comment) => comment.comment_id === commentId && comment.post_id === postId);
    if (commentIndex === -1) {
      this.logger.error(`Comment with id ${commentId} on post ${postId} not found for update`);
      throw new NotFoundException(`댓글 ${commentId}를 찾을 수 없습니다.`);
    }

    const updatedComment = { ...this.comments[commentIndex], ...updateCommentDto, updated_at: new Date() };
    this.logger.log(`Updating comment with id ${commentId} on post ${postId}: ${JSON.stringify(updatedComment)}`);
    this.comments[commentIndex] = updatedComment;
    return updatedComment;
  }

  // 댓글 삭제
  async deleteComment(postId: number, commentId: number): Promise<void> {
    const commentIndex = this.comments.findIndex((comment) => comment.comment_id === commentId && comment.post_id === postId);
    if (commentIndex === -1) {
      this.logger.error(`Comment with id ${commentId} on post ${postId} not found for deletion`);
      throw new NotFoundException(`댓글 ${commentId}를 찾을 수 없습니다.`);
    }

    this.comments.splice(commentIndex, 1);
    this.logger.log(`Deleted comment with id ${commentId} on post ${postId}`);

    // 게시글의 댓글 수 업데이트
    const post = await this.findOne(postId);
    if (post) {
      post.comments_count--;
    }
  }
}
