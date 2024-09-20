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
 * 2024.09.19    김재영      Modified    Swagger 문서화 수정 및 jwt 가드 추가
 */
import { Controller, Get, Post, Patch, Delete, Body, Param, Query, ParseIntPipe, Req, UseGuards, UnauthorizedException } from '@nestjs/common';
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
import { Request } from 'express';
import { Jwt } from '@_modules/auth/guards/jwt';
import { User } from '@_modules/user/entity/user.entity';
import { PostsResponseDto } from './dto/posts-response.dto';

@ApiTags('Community')
@Controller('community')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  @Get()
  @ApiOperation({ summary: '게시글 목록 조회 (페이지네이션 포함)' })
  @ApiQuery({ name: 'page', type: 'number', required: false, description: '페이지 번호' })
  @ApiQuery({ name: 'pageSize', type: 'number', required: false, description: '페이지당 항목 수' })
  @ApiResponse({ status: 200, description: '게시글 목록을 조회합니다.', type: PostsResponseDto })
  async getPosts(@Query() paginationQuery: PaginationQueryDto): Promise<PostsResponseDto> {
    const { posts, total } = await this.communityService.getAllPosts(paginationQuery);
    return new PostsResponseDto(total, posts);
  }

  @Get(':category')
  @ApiOperation({ summary: '카테고리별 게시글 조회 (페이지네이션 포함)' })
  @ApiParam({ name: 'category', type: 'string', description: '카테고리' })
  @ApiQuery({ name: 'page', type: 'number', required: false, description: '페이지 번호' })
  @ApiQuery({ name: 'pageSize', type: 'number', required: false, description: '페이지당 항목 수' })
  @ApiResponse({ status: 200, description: '카테고리별 게시글 목록을 조회합니다.', type: PostsResponseDto })
  async getPostsByCategory(@Param('category') category: Category, @Query() paginationQuery: PaginationQueryDto): Promise<PostsResponseDto> {
    const { posts, total } = await this.communityService.getPostsByCategory(category, paginationQuery);
    return new PostsResponseDto(total, posts);
  }

  @Post()
  @UseGuards(Jwt) // JWT 가드 적용
  @ApiOperation({ summary: '게시글 생성' })
  @ApiBody({ type: CreateCommunityDto })
  @ApiResponse({ status: 201, description: '게시글이 생성되었습니다.', type: Community })
  async createPost(@Req() request: Request, @Body() createCommunityDto: CreateCommunityDto): Promise<Community> {
    const user = request.user as User; // 타입 단언을 사용하여 user의 타입을 명시
    const userId = user?.id ?? null; // user 객체에서 id 추출

    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }

    return this.communityService.createPost(userId, createCommunityDto);
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
  @UseGuards(Jwt) // JWT 가드 적용
  @ApiOperation({ summary: '게시글 수정' })
  @ApiParam({ name: 'id', type: 'number', description: '게시글 ID' })
  @ApiBody({ type: UpdateCommunityDto })
  @ApiResponse({ status: 200, description: '게시글이 수정되었습니다.', type: Community })
  @ApiResponse({ status: 404, description: '게시글을 찾을 수 없습니다.' })
  async updatePost(@Req() request: Request, @Param('id', ParseIntPipe) id: number, @Body() updateCommunityDto: UpdateCommunityDto): Promise<Community> {
    const user = request.user as User; // 타입 단언을 사용하여 user의 타입을 명시
    const userId = user?.id ?? null; // user 객체에서 id 추출

    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }

    return this.communityService.updatePost(userId, id, updateCommunityDto);
  }

  @Delete(':id')
  @UseGuards(Jwt) // JWT 가드 적용
  @ApiOperation({ summary: '게시글 삭제' })
  @ApiParam({ name: 'id', type: 'number', description: '게시글 ID' })
  @ApiResponse({ status: 204, description: '게시글이 삭제되었습니다.' })
  @ApiResponse({ status: 404, description: '게시글을 찾을 수 없습니다.' })
  async deletePost(@Req() request: Request, @Param('id', ParseIntPipe) id: number): Promise<void> {
    const user = request.user as User; // 타입 단언을 사용하여 user의 타입을 명시
    const userId = user?.id ?? null; // user 객체에서 id 추출

    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }

    return this.communityService.deletePost(userId, id);
  }

  @Post(':postId/comments')
  @UseGuards(Jwt) // JWT 가드 적용
  @ApiOperation({ summary: '댓글 생성' })
  @ApiParam({ name: 'postId', type: 'number', description: '게시글 ID' })
  @ApiBody({ type: CreateCommentDto })
  @ApiResponse({ status: 201, description: '댓글이 생성되었습니다.', type: Comment })
  async createComment(@Req() request: Request, @Param('postId', ParseIntPipe) postId: number, @Body() createCommentDto: CreateCommentDto): Promise<Comment> {
    const user = request.user as User; // 타입 단언을 사용하여 user의 타입을 명시
    const userId = user?.id ?? null; // user 객체에서 id 추출

    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }

    return this.communityService.createComment(userId, postId, createCommentDto);
  }

  @Patch(':postId/comments/:commentId')
  @UseGuards(Jwt) // JWT 가드 적용
  @ApiOperation({ summary: '댓글 수정' })
  @ApiParam({ name: 'postId', type: 'number', description: '게시글 ID' })
  @ApiParam({ name: 'commentId', type: 'number', description: '댓글 ID' })
  @ApiBody({ type: UpdateCommentDto })
  @ApiResponse({ status: 200, description: '댓글이 수정되었습니다.', type: Comment })
  @ApiResponse({ status: 404, description: '댓글을 찾을 수 없습니다.' })
  async updateComment(
    @Req() request: Request,
    @Param('postId', ParseIntPipe) postId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    const user = request.user as User; // 타입 단언을 사용하여 user의 타입을 명시
    const userId = user?.id ?? null; // user 객체에서 id 추출

    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }

    return this.communityService.updateComment(userId, postId, commentId, updateCommentDto);
  }

  @Delete(':postId/comments/:commentId')
  @UseGuards(Jwt) // JWT 가드 적용
  @ApiOperation({ summary: '댓글 삭제' })
  @ApiParam({ name: 'postId', type: 'number', description: '게시글 ID' })
  @ApiParam({ name: 'commentId', type: 'number', description: '댓글 ID' })
  @ApiResponse({ status: 204, description: '댓글이 삭제되었습니다.' })
  @ApiResponse({ status: 404, description: '댓글을 찾을 수 없습니다.' })
  async deleteComment(@Req() request: Request, @Param('postId', ParseIntPipe) postId: number, @Param('commentId', ParseIntPipe) commentId: number): Promise<void> {
    const user = request.user as User; // 타입 단언을 사용하여 user의 타입을 명시
    const userId = user?.id ?? null; // user 객체에서 id 추출

    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }

    return this.communityService.deleteComment(userId, postId, commentId);
  }

  @Post(':postId/comments/:parentId/replies')
  @UseGuards(Jwt) // JWT 가드 적용
  @ApiOperation({ summary: '대댓글 생성' })
  @ApiParam({ name: 'postId', type: 'number', description: '게시글 ID' })
  @ApiParam({ name: 'parentId', type: 'number', description: '부모 댓글 ID' })
  @ApiBody({ type: CreateCommentDto })
  @ApiResponse({ status: 201, description: '대댓글이 생성되었습니다.', type: Comment })
  async createReply(
    @Req() request: Request,
    @Param('postId', ParseIntPipe) postId: number,
    @Param('parentId', ParseIntPipe) parentId: number,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    const user = request.user as User; // 타입 단언을 사용하여 user의 타입을 명시
    const userId = user?.id ?? null; // user 객체에서 id 추출

    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }

    return this.communityService.createReply(userId, postId, parentId, createCommentDto);
  }

  @Patch(':postId/comments/:commentId/replies')
  @UseGuards(Jwt) // JWT 가드 적용
  @ApiOperation({ summary: '대댓글 수정' })
  @ApiParam({ name: 'postId', type: 'number', description: '게시글 ID' })
  @ApiParam({ name: 'commentId', type: 'number', description: '대댓글 ID' })
  @ApiBody({ type: UpdateCommentDto })
  @ApiResponse({ status: 200, description: '대댓글이 수정되었습니다.', type: Comment })
  @ApiResponse({ status: 404, description: '대댓글을 찾을 수 없습니다.' })
  async updateReply(
    @Req() request: Request,
    @Param('postId', ParseIntPipe) postId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    const user = request.user as User; // 타입 단언을 사용하여 user의 타입을 명시
    const userId = user?.id ?? null; // user 객체에서 id 추출

    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }

    return this.communityService.updateReply(userId, postId, commentId, updateCommentDto);
  }

  @Delete(':postId/comments/:commentId/replies')
  @UseGuards(Jwt) // JWT 가드 적용
  @ApiOperation({ summary: '대댓글 삭제' })
  @ApiParam({ name: 'postId', type: 'number', description: '게시글 ID' })
  @ApiParam({ name: 'commentId', type: 'number', description: '대댓글 ID' })
  @ApiResponse({ status: 204, description: '대댓글이 삭제되었습니다.' })
  @ApiResponse({ status: 404, description: '대댓글을 찾을 수 없습니다.' })
  async deleteReply(@Req() request: Request, @Param('postId', ParseIntPipe) postId: number, @Param('commentId', ParseIntPipe) commentId: number): Promise<void> {
    const user = request.user as User; // 타입 단언을 사용하여 user의 타입을 명시
    const userId = user?.id ?? null; // user 객체에서 id 추출

    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }

    return this.communityService.deleteReply(userId, postId, commentId);
  }

  @Get(':postId/comments')
  @ApiOperation({ summary: '게시글에 대한 댓글 조회' })
  @ApiParam({ name: 'postId', type: 'number', description: '게시글 ID' })
  @ApiResponse({ status: 200, description: '게시글에 대한 댓글 목록을 조회합니다.', type: [Comment] })
  async getComments(@Param('postId', ParseIntPipe) postId: number, @Query() paginationQuery: PaginationQueryDto): Promise<Comment[]> {
    return this.communityService.getComments(postId, paginationQuery);
  }

  @Post(':postId/view')
  @ApiOperation({ summary: '게시글 조회수 증가' })
  @ApiParam({ name: 'postId', type: 'number', description: '게시글 ID' })
  @ApiResponse({ status: 200, description: '게시글 조회수를 증가시킵니다.' })
  async incrementViewCount(@Param('postId', ParseIntPipe) postId: number): Promise<void> {
    return this.communityService.incrementView(postId);
  }
}
