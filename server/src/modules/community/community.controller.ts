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

import { Controller, Get, Post, Patch, Delete, Param, Body, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import { CommunityService } from './community.service';
import { CreateCommunityDto } from './dto/create-community.dto';
import { UpdateCommunityDto } from './dto/update-community.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { Category } from './enums/category.enum';
import { Community } from './entities/community.entity';
import { Comment } from './entities/comment.entity';

@ApiTags('Community')
@Controller('community')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  @ApiOperation({ summary: '전체 게시글 조회 (페이지네이션 적용)' })
  @ApiQuery({ name: 'page', required: false, description: '페이지 번호', type: Number })
  @ApiQuery({ name: 'pageSize', required: false, description: '페이지 크기', type: Number })
  @Get()
  async getAllPosts(@Query() paginationQuery: PaginationQueryDto): Promise<Community[]> {
    return this.communityService.findAll(paginationQuery);
  }

  @ApiOperation({ summary: '특정 게시글 조회' })
  @ApiParam({ name: 'id', description: '게시글 ID', type: Number })
  @Get(':id')
  async getPostById(@Param('id', ParseIntPipe) id: number): Promise<Community> {
    return this.communityService.findOne(id);
  }

  @ApiOperation({ summary: '카테고리별 게시글 조회' })
  @ApiParam({ name: 'category', description: '게시글 카테고리', enum: Category })
  @ApiQuery({ name: 'page', required: false, description: '페이지 번호', type: Number })
  @ApiQuery({ name: 'pageSize', required: false, description: '페이지 크기', type: Number })
  @Get('category/:category')
  async getPostsByCategory(@Param('category') category: Category, @Query() paginationQuery: PaginationQueryDto): Promise<Community[]> {
    return this.communityService.findByCategory(category, paginationQuery);
  }

  @ApiOperation({ summary: '게시글 생성' })
  @ApiBody({ type: CreateCommunityDto })
  @Post()
  async createPost(@Body() createCommunityDto: CreateCommunityDto): Promise<Community> {
    return this.communityService.create(createCommunityDto);
  }

  @ApiOperation({ summary: '게시글 수정' })
  @ApiParam({ name: 'id', description: '게시글 ID', type: Number })
  @ApiBody({ type: UpdateCommunityDto })
  @Patch(':id')
  async updatePost(@Param('id', ParseIntPipe) id: number, @Body() updateCommunityDto: UpdateCommunityDto): Promise<void> {
    return this.communityService.update(id, updateCommunityDto);
  }

  @ApiOperation({ summary: '게시글 삭제' })
  @ApiParam({ name: 'id', description: '게시글 ID', type: Number })
  @Delete(':id')
  async deletePost(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.communityService.remove(id);
  }

  @ApiOperation({ summary: '게시글에 댓글 추가' })
  @ApiParam({ name: 'postId', description: '게시글 ID', type: Number })
  @ApiBody({ type: CreateCommentDto })
  @Post(':postId/comments')
  async addComment(@Param('postId', ParseIntPipe) postId: number, @Body() createCommentDto: CreateCommentDto): Promise<Comment> {
    return this.communityService.addComment(postId, createCommentDto);
  }

  @ApiOperation({ summary: '댓글 수정' })
  @ApiParam({ name: 'postId', description: '게시글 ID', type: Number })
  @ApiParam({ name: 'commentId', description: '댓글 ID', type: Number })
  @ApiBody({ type: UpdateCommentDto })
  @Patch(':postId/comments/:commentId')
  async updateComment(@Param('postId', ParseIntPipe) postId: number, @Param('commentId', ParseIntPipe) commentId: number, @Body() updateCommentDto: UpdateCommentDto): Promise<void> {
    return this.communityService.updateComment(postId, commentId, updateCommentDto);
  }

  @ApiOperation({ summary: '댓글 삭제' })
  @ApiParam({ name: 'postId', description: '게시글 ID', type: Number })
  @ApiParam({ name: 'commentId', description: '댓글 ID', type: Number })
  @Delete(':postId/comments/:commentId')
  async deleteComment(@Param('postId', ParseIntPipe) postId: number, @Param('commentId', ParseIntPipe) commentId: number): Promise<void> {
    return this.communityService.deleteComment(postId, commentId);
  }

  @ApiOperation({ summary: '댓글의 대댓글 개수 조회' })
  @ApiParam({ name: 'postId', description: '게시글 ID', type: Number })
  @ApiParam({ name: 'commentId', description: '댓글 ID', type: Number })
  @Get(':postId/comments/:commentId/replyCount')
  async getReplyCount(@Param('postId', ParseIntPipe) postId: number, @Param('commentId', ParseIntPipe) commentId: number): Promise<number> {
    return this.communityService.getReplyCount(commentId, postId);
  }

  @ApiOperation({ summary: '좋아요 수 증가' })
  @ApiParam({ name: 'id', description: '게시글 ID', type: Number })
  @Post(':id/like')
  async likePost(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.communityService.likePost(id);
  }

  @ApiOperation({ summary: '조회수 증가' })
  @ApiParam({ name: 'id', description: '게시글 ID', type: Number })
  @Post(':id/view')
  async increaseViewCount(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.communityService.increaseViewCount(id);
  }
}
