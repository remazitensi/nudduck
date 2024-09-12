/**
 * File Name    : community.controller.ts
 * Description  : 커뮤니티 컨트롤러
 * Author       : 김재영
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.07    김재영      Created     커뮤니티 컨트롤러 초기 생성 및 swagger 추가
 * 2024.09.09    김재영      Modified    게시글 CRUD API 메서드 구현
 * 2024.09.09    김재영      Modified    카테고리 내 특정 게시글 조회 기능 추가
 * 2024.09.10    김재영      Modified    댓글 및 대댓글 관련 API 추가 및 수정
 * 2024.09.10    김재영      Modified    TypeORM을 통한 데이터베이스 작업 처리 추가
 * 2024.09.11    김재영      Modified    페이지네이션 기능
 * 2024.09.12    김재영      Modified    좋아요 및 조회수 기능 추가
 */

import { Controller, Get, Post, Put, Delete, Param, Body, Query, NotFoundException, Logger, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CommunityService } from './community.service';
import { CreateCommunityDto } from './dto/create-community.dto';
import { UpdateCommunityDto } from './dto/update-community.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { Community } from './entities/community.entity';
import { Comment } from './entities/comment.entity';
import { Category } from './enums/category.enum';

@ApiTags('Community')
@Controller('community')
export class CommunityController {
  private readonly logger = new Logger(CommunityController.name);

  constructor(private readonly communityService: CommunityService) {}

  @ApiOperation({ summary: '전체 커뮤니티 게시글 목록 조회 (페이지네이션 지원)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: '결과 수 제한 (기본값: 10)' })
  @ApiQuery({ name: 'offset', required: false, type: Number, description: '결과 시작 지점 (기본값: 0)' })
  @Get()
  async getAllPosts(@Query() paginationQuery: PaginationQueryDto): Promise<Community[]> {
    this.logger.log('Fetching all posts with pagination');
    return this.communityService.findAll(paginationQuery);
  }

  @ApiOperation({ summary: '카테고리별 게시글 조회 (페이지네이션 지원)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: '결과 수 제한 (기본값: 10)' })
  @ApiQuery({ name: 'offset', required: false, type: Number, description: '결과 시작 지점 (기본값: 0)' })
  @Get(':category')
  async getPostsByCategory(@Param('category') category: string, @Query() paginationQuery: PaginationQueryDto): Promise<Community[]> {
    this.logger.log(`Fetching posts for category ${category} with pagination`);
    const categoryEnum = Category[category.toUpperCase() as keyof typeof Category];
    if (!categoryEnum) {
      this.logger.error(`Invalid category ${category}`);
      throw new NotFoundException(`유효하지 않은 카테고리 ${category}입니다.`);
    }
    return this.communityService.findByCategory(categoryEnum, paginationQuery);
  }

  @ApiOperation({ summary: '전체 게시글에서 특정 게시글 조회' })
  @Get(':id')
  async getPostById(@Param('id', ParseIntPipe) id: number): Promise<Community> {
    this.logger.log(`Received request to get post with id ${id}`);
    const post = await this.communityService.findOne(id);
    if (!post) {
      this.logger.error(`Post with id ${id} not found`);
      throw new NotFoundException(`게시글 ${id}를 찾을 수 없습니다.`);
    }
    return post;
  }

  @ApiOperation({ summary: '카테고리 내 특정 게시글 조회' })
  @Get(':category/:id')
  async getPostByCategoryAndId(@Param('category') category: string, @Param('id', ParseIntPipe) id: number): Promise<Community> {
    this.logger.log(`Received request to get post with id ${id} in category ${category}`);
    const categoryEnum = Category[category.toUpperCase() as keyof typeof Category];
    if (!categoryEnum) {
      this.logger.error(`Invalid category ${category}`);
      throw new NotFoundException(`유효하지 않은 카테고리 ${category}입니다.`);
    }
    const post = await this.communityService.findByIdAndCategory(id, categoryEnum);
    if (!post) {
      this.logger.error(`Post with id ${id} not found in category ${category}`);
      throw new NotFoundException(`${category} 카테고리 내 게시글 ${id}를 찾을 수 없습니다.`);
    }
    return post;
  }

  @ApiOperation({ summary: '게시글 작성' })
  @Post()
  async createPost(@Body() createCommunityDto: CreateCommunityDto): Promise<Community> {
    this.logger.log(`Creating post: ${JSON.stringify(createCommunityDto)}`);
    return this.communityService.create(createCommunityDto);
  }

  @ApiOperation({ summary: '게시글 수정' })
  @Put(':id')
  async updatePost(@Param('id', ParseIntPipe) id: number, @Body() updateCommunityDto: UpdateCommunityDto): Promise<Community> {
    this.logger.log(`Updating post with id ${id}`);
    const updatedPost = await this.communityService.update(id, updateCommunityDto);
    if (!updatedPost) {
      this.logger.error(`Post with id ${id} not found for update`);
      throw new NotFoundException(`게시글 ${id}를 찾을 수 없습니다.`);
    }
    return updatedPost;
  }

  @ApiOperation({ summary: '게시글 삭제' })
  @Delete(':id')
  async deletePost(@Param('id', ParseIntPipe) id: number): Promise<void> {
    this.logger.log(`Deleting post with id ${id}`);
    await this.communityService.remove(id);
  }

  // 댓글 관련 API

  @ApiOperation({ summary: '댓글 작성' })
  @Post(':postId/comments')
  async addComment(@Param('postId', ParseIntPipe) postId: number, @Body() createCommentDto: CreateCommentDto): Promise<Comment> {
    this.logger.log(`Adding comment to post with id ${postId}`);
    return this.communityService.addComment(postId, createCommentDto);
  }

  @ApiOperation({ summary: '댓글 수정' })
  @Put(':postId/comments/:commentId')
  async updateComment(@Param('postId', ParseIntPipe) postId: number, @Param('commentId', ParseIntPipe) commentId: number, @Body() updateCommentDto: UpdateCommentDto): Promise<Comment> {
    this.logger.log(`Updating comment with id ${commentId} on post ${postId}`);
    const updatedComment = await this.communityService.updateComment(postId, commentId, updateCommentDto);
    if (!updatedComment) {
      this.logger.error(`Comment with id ${commentId} on post ${postId} not found for update`);
      throw new NotFoundException(`댓글 ${commentId}를 찾을 수 없습니다.`);
    }
    return updatedComment;
  }

  @ApiOperation({ summary: '댓글 삭제' })
  @Delete(':postId/comments/:commentId')
  async deleteComment(@Param('postId', ParseIntPipe) postId: number, @Param('commentId', ParseIntPipe) commentId: number): Promise<void> {
    this.logger.log(`Deleting comment with id ${commentId} on post ${postId}`);
    await this.communityService.deleteComment(postId, commentId);
  }

  @ApiOperation({ summary: '댓글의 대댓글 조회' })
  @Get(':postId/comments/:commentId/replies')
  async getReplies(@Param('postId', ParseIntPipe) postId: number, @Param('commentId', ParseIntPipe) commentId: number): Promise<Comment[]> {
    this.logger.log(`Fetching replies for comment with id ${commentId} on post ${postId}`);
    return this.communityService.getReplies(postId, commentId);
  }

  // 좋아요 관련 API

  @ApiOperation({ summary: '게시글 좋아요 수 증가' })
  @Post(':id/likes')
  async incrementLikes(@Param('id', ParseIntPipe) id: number): Promise<Community> {
    this.logger.log(`Incrementing likes for post with id ${id}`);
    return this.communityService.incrementLikes(id);
  }

  @ApiOperation({ summary: '게시글 좋아요 수 감소' })
  @Post(':id/likes/decrement')
  async decrementLikes(@Param('id', ParseIntPipe) id: number): Promise<Community> {
    this.logger.log(`Decrementing likes for post with id ${id}`);
    return this.communityService.decrementLikes(id);
  }

  // 조회수 관련 API

  @ApiOperation({ summary: '게시글 조회수 증가' })
  @Get(':id/views')
  async incrementViews(@Param('id', ParseIntPipe) id: number): Promise<Community> {
    this.logger.log(`Incrementing views for post with id ${id}`);
    return this.communityService.incrementViews(id);
  }
}
