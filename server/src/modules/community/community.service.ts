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
 * 2024.09.10    김재영      Modified    TypeORM을 통한 데이터베이스 작업 처리 추가
 * 2024.09.11    김재영      Modified    페이지네이션 기능 추가 및 개선
 */

import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Community } from './entities/community.entity';
import { Comment } from './entities/comment.entity';
import { Category } from './enums/category.enum';
import { CreateCommunityDto } from './dto/create-community.dto';
import { UpdateCommunityDto } from './dto/update-community.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';

@Injectable()
export class CommunityService {
  private readonly logger = new Logger(CommunityService.name);

  constructor(
    @InjectRepository(Community)
    private communityRepository: Repository<Community>,
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {}

  // 전체 게시글 조회 (페이지네이션 적용)
  async findAll(paginationQuery: PaginationQueryDto): Promise<Community[]> {
    const { page = 1, pageSize = 10 } = paginationQuery;
    const limit = pageSize;
    const offset = (page - 1) * pageSize;

    this.logger.log(`Fetching all posts with limit ${limit} and offset ${offset}`);
    return this.communityRepository.find({
      skip: offset,
      take: limit,
    });
  }

  // 특정 게시글 조회
  async findOne(id: number): Promise<Community | null> {
    this.logger.log(`Fetching post with id ${id}`);
    return this.communityRepository.findOne({ where: { post_id: id } });
  }

  // 카테고리별 게시글 조회 (페이지네이션 적용)
  async findByCategory(category: Category, paginationQuery: PaginationQueryDto): Promise<Community[]> {
    const { page = 1, pageSize = 10 } = paginationQuery;
    const limit = pageSize;
    const offset = (page - 1) * pageSize;

    this.logger.log(`Fetching posts in category ${category} with limit ${limit} and offset ${offset}`);
    return this.communityRepository.find({
      where: { category },
      skip: offset,
      take: limit,
    });
  }

  // 카테고리와 ID로 게시글 조회
  async findByIdAndCategory(id: number, category: Category): Promise<Community | null> {
    this.logger.log(`Fetching post with id ${id} in category ${category}`);
    return this.communityRepository.findOne({ where: { post_id: id, category } });
  }

  // 게시글 생성
  async create(createCommunityDto: CreateCommunityDto): Promise<Community> {
    const newPost = this.communityRepository.create({
      ...createCommunityDto,
      created_at: new Date(),
      updated_at: new Date(),
      likes_count: 0,
      views_count: 0,
      comments_count: 0,
    });
    this.logger.log(`Creating new post: ${JSON.stringify(newPost)}`);
    return this.communityRepository.save(newPost);
  }

  // 게시글 수정
  async update(id: number, updateCommunityDto: UpdateCommunityDto): Promise<Community | null> {
    const post = await this.communityRepository.findOne({ where: { post_id: id } });
    if (!post) {
      this.logger.error(`Post with id ${id} not found for update`);
      throw new NotFoundException(`게시글 ${id}를 찾을 수 없습니다.`);
    }

    const updatedPost = this.communityRepository.merge(post, updateCommunityDto, { updated_at: new Date() });
    this.logger.log(`Updating post with id ${id}: ${JSON.stringify(updatedPost)}`);
    return this.communityRepository.save(updatedPost);
  }

  // 게시글 삭제
  async remove(id: number): Promise<void> {
    const post = await this.communityRepository.findOne({ where: { post_id: id } });
    if (!post) {
      this.logger.error(`Post with id ${id} not found for deletion`);
      throw new NotFoundException(`게시글 ${id}를 찾을 수 없습니다.`);
    }

    await this.communityRepository.remove(post);
    this.logger.log(`Deleted post with id ${id}`);
  }

  // 댓글 작성
  async addComment(postId: number, createCommentDto: CreateCommentDto): Promise<Comment> {
    const post = await this.findOne(postId);
    if (!post) {
      this.logger.error(`Post with id ${postId} not found for adding comment`);
      throw new NotFoundException(`게시글 ${postId}를 찾을 수 없습니다.`);
    }

    const newComment = this.commentRepository.create({
      ...createCommentDto,
      post_id: postId,
      created_at: new Date(),
      updated_at: new Date(),
    });

    this.logger.log(`Adding new comment: ${JSON.stringify(newComment)}`);
    await this.commentRepository.save(newComment);

    // 게시글의 댓글 수 업데이트
    post.comments_count++;
    await this.communityRepository.save(post);

    return newComment;
  }

  // 댓글 수정
  async updateComment(postId: number, commentId: number, updateCommentDto: UpdateCommentDto): Promise<Comment | null> {
    const comment = await this.commentRepository.findOne({ where: { comment_id: commentId, post_id: postId } });
    if (!comment) {
      this.logger.error(`Comment with id ${commentId} on post ${postId} not found for update`);
      throw new NotFoundException(`댓글 ${commentId}를 찾을 수 없습니다.`);
    }

    const updatedComment = this.commentRepository.merge(comment, updateCommentDto, { updated_at: new Date() });
    this.logger.log(`Updating comment with id ${commentId} on post ${postId}: ${JSON.stringify(updatedComment)}`);
    return this.commentRepository.save(updatedComment);
  }

  // 댓글 삭제
  async deleteComment(postId: number, commentId: number): Promise<void> {
    const comment = await this.commentRepository.findOne({ where: { comment_id: commentId, post_id: postId } });
    if (!comment) {
      this.logger.error(`Comment with id ${commentId} on post ${postId} not found for deletion`);
      throw new NotFoundException(`댓글 ${commentId}를 찾을 수 없습니다.`);
    }

    await this.commentRepository.remove(comment);
    this.logger.log(`Deleted comment with id ${commentId} on post ${postId}`);

    // 게시글의 댓글 수 업데이트
    const post = await this.findOne(postId);
    if (post) {
      post.comments_count--;
      await this.communityRepository.save(post);
    }
  }

  // 댓글의 대댓글 조회
  async getReplies(postId: number, commentId: number): Promise<Comment[]> {
    return this.commentRepository.find({ where: { parent_id: commentId, post_id: postId } });
  }
}
