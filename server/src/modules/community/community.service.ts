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
 * 2024.09.12    김재영      Modified    게시글과 댓글의 대댓글 처리 로직 추가 및 리팩토링
 * 2024.09.12    김재영      Modified    좋아요 및 조회수 기능 추가
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
    const skip = (page - 1) * pageSize;

    this.logger.log(`Fetching all posts with page ${page} and pageSize ${pageSize}`);
    return this.communityRepository.find({
      skip,
      take: pageSize,
    });
  }

  // 특정 게시글 조회
  async findOne(id: number): Promise<Community> {
    this.logger.log(`Fetching post with id ${id}`);
    const post = await this.communityRepository.findOne({ where: { post_id: id } });
    if (!post) {
      this.logger.error(`Post with id ${id} not found`);
      throw new NotFoundException(`게시글 ${id}를 찾을 수 없습니다.`);
    }
    return post;
  }

  // 카테고리별 게시글 조회 (페이지네이션 적용)
  async findByCategory(category: Category, paginationQuery: PaginationQueryDto): Promise<Community[]> {
    const { page = 1, pageSize = 10 } = paginationQuery;
    const skip = (page - 1) * pageSize;

    this.logger.log(`Fetching posts in category ${category} with page ${page} and pageSize ${pageSize}`);
    return this.communityRepository.find({
      where: { category },
      skip,
      take: pageSize,
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
  async update(id: number, updateCommunityDto: UpdateCommunityDto): Promise<Community> {
    const post = await this.findOne(id);
    Object.assign(post, updateCommunityDto, { updated_at: new Date() });
    this.logger.log(`Updating post with id ${id}: ${JSON.stringify(post)}`);
    return this.communityRepository.save(post);
  }

  // 게시글 삭제
  async remove(id: number): Promise<void> {
    const post = await this.findOne(id);
    await this.communityRepository.remove(post);
    this.logger.log(`Deleted post with id ${id}`);
  }

  // 댓글 작성
  async addComment(postId: number, createCommentDto: CreateCommentDto): Promise<Comment> {
    const post = await this.findOne(postId);
    const newComment = this.commentRepository.create({
      ...createCommentDto,
      post_id: postId,
      created_at: new Date(),
      updated_at: new Date(),
    });

    this.logger.log(`Adding new comment: ${JSON.stringify(newComment)}`);
    const savedComment = await this.commentRepository.save(newComment);

    // 게시글의 댓글 수 업데이트
    post.comments_count++;
    await this.communityRepository.save(post);

    return savedComment;
  }

  // 댓글 수정
  async updateComment(postId: number, commentId: number, updateCommentDto: UpdateCommentDto): Promise<Comment> {
    const comment = await this.commentRepository.findOne({ where: { comment_id: commentId, post_id: postId } });
    if (!comment) {
      this.logger.error(`Comment with id ${commentId} on post ${postId} not found for update`);
      throw new NotFoundException(`댓글 ${commentId}를 찾을 수 없습니다.`);
    }

    Object.assign(comment, updateCommentDto, { updated_at: new Date() });
    this.logger.log(`Updating comment with id ${commentId} on post ${postId}: ${JSON.stringify(comment)}`);
    return this.commentRepository.save(comment);
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
  // 댓글 조회
  async getCommentsByPostId(postId: number): Promise<Comment[]> {
    this.logger.log(`Fetching comments for post with id ${postId}`);

    const comments = await this.commentRepository.find({ where: { post_id: postId } });

    // 각 댓글에 대한 대댓글 개수 추가
    for (const comment of comments) {
      comment['repliesCount'] = await this.getRepliesCount(comment.comment_id, postId);
    }

    return comments;
  }

  // 대댓글 작성
  async addReply(postId: number, parentId: number, createCommentDto: CreateCommentDto): Promise<Comment> {
    this.logger.log(`Adding reply to comment ${parentId} on post ${postId}`);

    const parentComment = await this.commentRepository.findOne({ where: { comment_id: parentId, post_id: postId } });
    if (!parentComment) {
      throw new NotFoundException(`부모 댓글 ID ${parentId}를 찾을 수 없습니다.`);
    }

    const newReply = this.commentRepository.create({
      ...createCommentDto,
      parent_id: parentId,
      post_id: postId,
      created_at: new Date(),
      updated_at: new Date(),
    });

    // 부모 댓글의 대댓글 개수 업데이트
    parentComment['repliesCount'] = await this.getRepliesCount(parentId, postId);

    return this.commentRepository.save(newReply);
  }

  // 대댓글 수정
  async updateReply(postId: number, commentId: number, updateCommentDto: UpdateCommentDto): Promise<Comment> {
    this.logger.log(`Updating reply ${commentId} on post ${postId}`);

    const reply = await this.commentRepository.findOne({ where: { comment_id: commentId, post_id: postId } });
    if (!reply) {
      throw new NotFoundException(`대댓글 ID ${commentId}를 찾을 수 없습니다.`);
    }

    Object.assign(reply, updateCommentDto, { updated_at: new Date() });

    // 부모 댓글의 대댓글 개수 업데이트
    const parentCommentId = reply.parent_id;
    const parentComment = await this.commentRepository.findOne({ where: { comment_id: parentCommentId, post_id: postId } });
    if (parentComment) {
      parentComment['repliesCount'] = await this.getRepliesCount(parentCommentId, postId);
    }

    return this.commentRepository.save(reply);
  }

  // 대댓글 삭제
  async deleteReply(postId: number, commentId: number): Promise<void> {
    this.logger.log(`Deleting reply ${commentId} on post ${postId}`);

    const reply = await this.commentRepository.findOne({ where: { comment_id: commentId, post_id: postId } });
    if (!reply) {
      throw new NotFoundException(`대댓글 ID ${commentId}를 찾을 수 없습니다.`);
    }

    await this.commentRepository.remove(reply);

    // 부모 댓글의 대댓글 개수 업데이트
    const parentCommentId = reply.parent_id;
    const parentComment = await this.commentRepository.findOne({ where: { comment_id: parentCommentId, post_id: postId } });
    if (parentComment) {
      parentComment['repliesCount'] = await this.getRepliesCount(parentCommentId, postId);
    }
  }

  // 댓글의 대댓글 조회
  async getReplies(postId: number, commentId: number): Promise<Comment[]> {
    this.logger.log(`Fetching replies for comment ${commentId} on post ${postId}`);

    const replies = await this.commentRepository.find({ where: { parent_id: commentId, post_id: postId } });

    // 각 대댓글에 대한 대댓글 개수 추가
    for (const reply of replies) {
      reply['repliesCount'] = await this.getRepliesCount(reply.comment_id, postId);
    }

    return replies;
  }

  // 대댓글 개수 계산
  public async getRepliesCount(commentId: number, postId: number): Promise<number> {
    return this.commentRepository.count({ where: { parent_id: commentId, post_id: postId } });
  }

  // 좋아요 수 증가
  async incrementLikes(id: number): Promise<Community> {
    const post = await this.findOne(id);
    post.likes_count++;
    this.logger.log(`Incrementing likes for post with id ${id}: ${post.likes_count}`);
    return this.communityRepository.save(post);
  }

  // 좋아요 수 감소
  async decrementLikes(id: number): Promise<Community> {
    const post = await this.findOne(id);
    if (post.likes_count > 0) {
      post.likes_count--;
      this.logger.log(`Decrementing likes for post with id ${id}: ${post.likes_count}`);
      return this.communityRepository.save(post);
    }
    this.logger.warn(`Post with id ${id} has no likes to remove`);
    return post;
  }

  // 조회수 증가
  async incrementViews(id: number): Promise<Community> {
    const post = await this.findOne(id);
    post.views_count++;
    this.logger.log(`Incrementing views for post with id ${id}: ${post.views_count}`);
    return this.communityRepository.save(post);
  }
}
