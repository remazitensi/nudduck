/**
 * File Name    : community.controller.ts
 * Description  : 커뮤니티 컨트롤러
 * Author       : 김재영
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.07    김재영      Created     커뮤니티 컨트롤러 초기 생성
 * 2024.09.09    김재영      Modified    게시글 CRUD 메서드 구현
 * 2024.09.10    김재영      Modified    댓글 관련 API 메서드 추가
 * 2024.09.11    김재영      Modified    페이지네이션 기능 추가 및 개선
 * 2024.09.12    김재영      Modified    게시글과 댓글의 대댓글 처리 로직 추가 및 리팩토링
 * 2024.09.12    김재영      Modified    좋아요 및 조회수 기능 추가
 * 2024.09.18    김재영      Modified    Swagger 문서화 적용
 * 2024.09.19    김재영      Modified    Swagger 문서화 수정
 */

import { Controller, Get, Post, Patch, Delete, Body, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';
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
  constructor(private readonly communityService: CommunityService) {}

  @Get()
  @ApiOperation({ summary: '게시글 목록 조회 (페이지네이션 포함)' })
  @ApiQuery({ name: 'page', type: 'number', required: false, description: '페이지 번호' })
  @ApiQuery({ name: 'limit', type: 'number', required: false, description: '페이지당 항목 수' })
  @ApiResponse({ status: 200, description: '게시글 목록을 조회합니다.', type: [Community] })
  async getPosts(@Query() paginationQuery: PaginationQueryDto): Promise<Community[]> {
    return this.communityService.getAllPosts(paginationQuery);
  }

  @Get(':category')
  @ApiOperation({ summary: '카테고리별 게시글 조회 (페이지네이션 포함)' })
  @ApiParam({ name: 'category', type: 'string', description: '카테고리' })
  @ApiQuery({ name: 'page', type: 'number', required: false, description: '페이지 번호' })
  @ApiQuery({ name: 'limit', type: 'number', required: false, description: '페이지당 항목 수' })
  @ApiResponse({ status: 200, description: '카테고리별 게시글 목록을 조회합니다.', type: [Community] })
  async getPostsByCategory(@Param('category') category: Category, @Query() paginationQuery: PaginationQueryDto): Promise<Community[]> {
    return this.communityService.getPostsByCategory(category, paginationQuery);
  }

  @Post()
  @ApiOperation({ summary: '게시글 생성' })
  @ApiBody({ type: CreateCommunityDto })
  @ApiResponse({ status: 201, description: '게시글이 생성되었습니다.', type: Community })
  async createPost(@Body() createCommunityDto: CreateCommunityDto): Promise<Community> {
    return this.communityService.createPost(createCommunityDto);
  }

  @Get(':id')
  @ApiOperation({ summary: '게시글 조회' })
  @ApiParam({ name: 'id', type: 'number', description: '게시글 ID' })
  @ApiResponse({ status: 200, description: '게시글을 조회합니다.', type: Community })
  @ApiResponse({ status: 404, description: '게시글을 찾을 수 없습니다.' })
  async getPostById(@Param('id', ParseIntPipe) id: number): Promise<Community> {
    return this.communityService.getPostById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '게시글 수정' })
  @ApiParam({ name: 'id', type: 'number', description: '게시글 ID' })
  @ApiBody({ type: UpdateCommunityDto })
  @ApiResponse({ status: 200, description: '게시글이 수정되었습니다.', type: Community })
  @ApiResponse({ status: 404, description: '게시글을 찾을 수 없습니다.' })
  async updatePost(@Param('id', ParseIntPipe) id: number, @Body() updateCommunityDto: UpdateCommunityDto): Promise<Community> {
    return this.communityService.updatePost(id, updateCommunityDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '게시글 삭제' })
  @ApiParam({ name: 'id', type: 'number', description: '게시글 ID' })
  @ApiResponse({ status: 204, description: '게시글이 삭제되었습니다.' })
  @ApiResponse({ status: 404, description: '게시글을 찾을 수 없습니다.' })
  async deletePost(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.communityService.deletePost(id);
  }

  @Post(':postId/comments')
  @ApiOperation({ summary: '댓글 생성' })
  @ApiParam({ name: 'postId', type: 'number', description: '게시글 ID' })
  @ApiBody({ type: CreateCommentDto })
  @ApiResponse({ status: 201, description: '댓글이 생성되었습니다.', type: Comment })
  async createComment(@Param('postId', ParseIntPipe) postId: number, @Body() createCommentDto: CreateCommentDto): Promise<Comment> {
    return this.communityService.createComment(postId, createCommentDto);
  }

  @Patch(':postId/comments/:commentId')
  @ApiOperation({ summary: '댓글 수정' })
  @ApiParam({ name: 'postId', type: 'number', description: '게시글 ID' })
  @ApiParam({ name: 'commentId', type: 'number', description: '댓글 ID' })
  @ApiBody({ type: UpdateCommentDto })
  @ApiResponse({ status: 200, description: '댓글이 수정되었습니다.', type: Comment })
  @ApiResponse({ status: 404, description: '댓글을 찾을 수 없습니다.' })
  async updateComment(@Param('postId', ParseIntPipe) postId: number, @Param('commentId', ParseIntPipe) commentId: number, @Body() updateCommentDto: UpdateCommentDto): Promise<Comment> {
    return this.communityService.updateComment(postId, commentId, updateCommentDto);
  }

  @Delete(':postId/comments/:commentId')
  @ApiOperation({ summary: '댓글 삭제' })
  @ApiParam({ name: 'postId', type: 'number', description: '게시글 ID' })
  @ApiParam({ name: 'commentId', type: 'number', description: '댓글 ID' })
  @ApiResponse({ status: 204, description: '댓글이 삭제되었습니다.' })
  @ApiResponse({ status: 404, description: '댓글을 찾을 수 없습니다.' })
  async deleteComment(@Param('postId', ParseIntPipe) postId: number, @Param('commentId', ParseIntPipe) commentId: number): Promise<void> {
    return this.communityService.deleteComment(postId, commentId);
  }

  @Post(':postId/comments/:parentId/replies')
  @ApiOperation({ summary: '대댓글 생성' })
  @ApiParam({ name: 'postId', type: 'number', description: '게시글 ID' })
  @ApiParam({ name: 'parentId', type: 'number', description: '부모 댓글 ID' })
  @ApiBody({ type: CreateCommentDto })
  @ApiResponse({ status: 201, description: '대댓글이 생성되었습니다.', type: Comment })
  async createReply(@Param('postId', ParseIntPipe) postId: number, @Param('parentId', ParseIntPipe) parentId: number, @Body() createCommentDto: CreateCommentDto): Promise<Comment> {
    return this.communityService.createReply(postId, parentId, createCommentDto);
  }

  @Patch(':postId/comments/:commentId/replies')
  @ApiOperation({ summary: '대댓글 수정' })
  @ApiParam({ name: 'postId', type: 'number', description: '게시글 ID' })
  @ApiParam({ name: 'commentId', type: 'number', description: '대댓글 ID' })
  @ApiBody({ type: UpdateCommentDto })
  @ApiResponse({ status: 200, description: '대댓글이 수정되었습니다.', type: Comment })
  @ApiResponse({ status: 404, description: '대댓글을 찾을 수 없습니다.' })
  async updateReply(@Param('postId', ParseIntPipe) postId: number, @Param('commentId', ParseIntPipe) commentId: number, @Body() updateCommentDto: UpdateCommentDto): Promise<Comment> {
    return this.communityService.updateReply(postId, commentId, updateCommentDto);
  }

  @Delete(':postId/comments/:commentId/replies')
  @ApiOperation({ summary: '대댓글 삭제' })
  @ApiParam({ name: 'postId', type: 'number', description: '게시글 ID' })
  @ApiParam({ name: 'commentId', type: 'number', description: '대댓글 ID' })
  @ApiResponse({ status: 204, description: '대댓글이 삭제되었습니다.' })
  @ApiResponse({ status: 404, description: '대댓글을 찾을 수 없습니다.' })
  async deleteReply(@Param('postId', ParseIntPipe) postId: number, @Param('commentId', ParseIntPipe) commentId: number): Promise<void> {
    return this.communityService.deleteReply(postId, commentId);
  }

  @Get(':postId/comments')
  @ApiOperation({ summary: '댓글 목록 조회 (페이지네이션 포함)' })
  @ApiParam({ name: 'postId', type: 'number', description: '게시글 ID' })
  @ApiQuery({ name: 'page', type: 'number', required: false, description: '페이지 번호' })
  @ApiQuery({ name: 'limit', type: 'number', required: false, description: '페이지당 항목 수' })
  @ApiResponse({ status: 200, description: '댓글 목록을 조회합니다.', type: [Comment] })
  async getComments(@Param('postId', ParseIntPipe) postId: number, @Query('page', ParseIntPipe) page = 1, @Query('limit', ParseIntPipe) limit = 10): Promise<Comment[]> {
    return this.communityService.getComments(postId, page, limit);
  }

  @Get(':postId/comments/:commentId/replies')
  @ApiOperation({ summary: '특정 댓글에 대한 대댓글 목록 조회' })
  @ApiParam({ name: 'postId', type: 'number', description: '게시글 ID' })
  @ApiParam({ name: 'commentId', type: 'number', description: '댓글 ID' })
  @ApiResponse({ status: 200, description: '대댓글 목록을 조회합니다.', type: [Comment] })
  async getReplies(@Param('postId', ParseIntPipe) postId: number, @Param('commentId', ParseIntPipe) commentId: number): Promise<Comment[]> {
    return this.communityService.getReplies(postId, commentId);
  }

  @Post(':id/likes')
  @ApiOperation({ summary: '게시글 좋아요 추가' })
  @ApiParam({ name: 'id', type: 'number', description: '게시글 ID' })
  @ApiResponse({ status: 200, description: '게시글 좋아요가 추가되었습니다.' })
  async addLike(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.communityService.incrementLikes(id);
  }

  @Delete(':id/likes')
  @ApiOperation({ summary: '게시글 좋아요 취소' })
  @ApiParam({ name: 'id', type: 'number', description: '게시글 ID' })
  @ApiResponse({ status: 200, description: '게시글 좋아요가 취소되었습니다.' })
  async removeLike(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.communityService.decrementLikes(id);
  }

  @Post(':id/views')
  @ApiOperation({ summary: '게시글 조회수 증가' })
  @ApiParam({ name: 'id', type: 'number', description: '게시글 ID' })
  @ApiResponse({ status: 200, description: '게시글 조회수가 증가되었습니다.' })
  async incrementViews(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.communityService.incrementViews(id);
  }
}
