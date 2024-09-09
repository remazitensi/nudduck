/**
 * File Name    : community.controller.ts
 * Description  : 커뮤니티 컨트롤러
 * Author       : 김재영
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.07    김재영      Created     커뮤니티 컨트롤러 초기 생성
 * 2024.09.09    김재영      Modified    게시글 CRUD API 메서드 구현
 * 2024.09.09    김재영      Modified    카테고리 내 특정 게시글 조회 기능 추가
 * 2024.09.10    김재영      Modified    댓글 및 대댓글 관련 API 추가 및 수정
 */

import { Controller, Get, Post, Put, Delete, Param, Body, NotFoundException, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CommunityService } from './community.service';
import { CreateCommunityDto } from './dto/create-community.dto';
import { UpdateCommunityDto } from './dto/update-community.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Community } from './entities/community.entity';
import { Comment } from './entities/comment.entity'; // Comment 엔티티 임포트 추가
import { Category } from './enums/category.enum';

@ApiTags('Community')
@Controller('community')
export class CommunityController {
  private readonly logger = new Logger(CommunityController.name);

  constructor(private readonly communityService: CommunityService) {}

  // 커뮤니티 게시글 관련 API

  @ApiOperation({ summary: '전체 커뮤니티 게시글 목록 조회' })
  @Get()
  async getAllPosts(): Promise<Community[]> {
    this.logger.log('Fetching all posts');
    return this.communityService.findAll();
  }

  @ApiOperation({ summary: '카테고리별 게시글 조회' })
  @Get(':category')
  async getPostsByCategory(@Param('category') category: string): Promise<Community[]> {
    this.logger.log(`Fetching posts for category ${category}`);
    const categoryEnum = Category[category.toUpperCase() as keyof typeof Category];
    if (!categoryEnum) {
      this.logger.error(`Invalid category ${category}`);
      throw new NotFoundException(`유효하지 않은 카테고리 ${category}입니다.`);
    }
    return this.communityService.findByCategory(categoryEnum);
  }

  @ApiOperation({ summary: '카테고리 내 특정 게시글 조회' })
  @Get(':category/:id')
  async getPostByCategoryAndId(@Param('category') category: string, @Param('id') id: number): Promise<Community> {
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

  @ApiOperation({ summary: '게시글 조회' })
  @Get(':id')
  async getPostById(@Param('id') id: string): Promise<Community> {
    this.logger.log(`Fetching post with id ${id}`);
    const post = await this.communityService.findOne(+id);
    if (!post) {
      this.logger.error(`Post with id ${id} not found`);
      throw new NotFoundException(`게시글 ${id}를 찾을 수 없습니다.`);
    }
    return post;
  }

  @ApiOperation({ summary: '게시글 수정' })
  @Put(':id')
  async updatePost(@Param('id') id: string, @Body() updateCommunityDto: UpdateCommunityDto): Promise<Community> {
    this.logger.log(`Updating post with id ${id}: ${JSON.stringify(updateCommunityDto)}`);
    const updatedPost = await this.communityService.update(+id, updateCommunityDto);
    if (!updatedPost) {
      this.logger.error(`Post with id ${id} not found for update`);
      throw new NotFoundException(`게시글 ${id}를 수정할 수 없습니다.`);
    }
    return updatedPost;
  }

  @ApiOperation({ summary: '게시글 삭제' })
  @Delete(':id')
  async deletePost(@Param('id') id: string): Promise<void> {
    this.logger.log(`Deleting post with id ${id}`);
    const exists = await this.communityService.findOne(+id);
    if (!exists) {
      this.logger.error(`Post with id ${id} not found for deletion`);
      throw new NotFoundException(`게시글 ${id}를 삭제할 수 없습니다.`);
    }
    await this.communityService.remove(+id);
  }

  // 댓글 및 대댓글 관련 API

  @ApiOperation({ summary: '게시글에 댓글 작성' })
  @Post(':id/comments')
  async addComment(@Param('id') postId: string, @Body() createCommentDto: CreateCommentDto): Promise<Comment> {
    this.logger.log(`Adding comment to post with id ${postId}: ${JSON.stringify(createCommentDto)}`);
    return this.communityService.addComment(+postId, createCommentDto);
  }

  @ApiOperation({ summary: '댓글 수정' })
  @Put(':id/comments/:commentId')
  async updateComment(@Param('id') postId: string, @Param('commentId') commentId: string, @Body() updateCommentDto: UpdateCommentDto): Promise<Comment> {
    this.logger.log(`Updating comment with id ${commentId} on post with id ${postId}: ${JSON.stringify(updateCommentDto)}`);
    return this.communityService.updateComment(+postId, +commentId, updateCommentDto);
  }

  @ApiOperation({ summary: '댓글 삭제' })
  @Delete(':id/comments/:commentId')
  async deleteComment(@Param('id') postId: string, @Param('commentId') commentId: string): Promise<void> {
    this.logger.log(`Deleting comment with id ${commentId} on post with id ${postId}`);
    await this.communityService.deleteComment(+postId, +commentId);
  }

  @ApiOperation({ summary: '댓글에 대댓글 작성' })
  @Post(':id/comments/:commentId/replies')
  async addReply(@Param('id') postId: string, @Param('commentId') commentId: string, @Body() createCommentDto: CreateCommentDto): Promise<Comment> {
    this.logger.log(`Adding reply to comment with id ${commentId} on post with id ${postId}: ${JSON.stringify(createCommentDto)}`);
    createCommentDto.parent_id = +commentId; // 대댓글이므로 parent_id 설정
    return this.communityService.addComment(+postId, createCommentDto);
  }
}
