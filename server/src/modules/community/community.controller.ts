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
 */

import { Controller, Get, Post, Put, Delete, Param, Body, NotFoundException, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CommunityService } from './community.service';
import { CreateCommunityDto } from './dto/create-community.dto';
import { UpdateCommunityDto } from './dto/update-community.dto';
import { Community } from './entities/community.entity';
import { Category } from './enums/category.enum';

@ApiTags('Community')
@Controller('community')
export class CommunityController {
  private readonly logger = new Logger(CommunityController.name);

  constructor(private readonly communityService: CommunityService) {}

  @ApiOperation({ summary: '전체 커뮤니티 게시글 목록 조회' })
  @Get()
  async getAllPosts(): Promise<Community[]> {
    this.logger.log('Fetching all posts');
    return this.communityService.findAll();
  }

  @ApiOperation({ summary: '면접 관련 게시글 조회' })
  @Get('interview')
  async getInterviewPosts(): Promise<Community[]> {
    this.logger.log('Fetching interview posts');
    return this.communityService.findByCategory(Category.INTERVIEW);
  }

  @ApiOperation({ summary: '스터디 관련 게시글 조회' })
  @Get('study')
  async getStudyPosts(): Promise<Community[]> {
    this.logger.log('Fetching study posts');
    return this.communityService.findByCategory(Category.STUDY);
  }

  @ApiOperation({ summary: '잡담 관련 게시글 조회' })
  @Get('talk')
  async getChatPosts(): Promise<Community[]> {
    this.logger.log('Fetching chat posts');
    return this.communityService.findByCategory(Category.TALK);
  }

  @ApiOperation({ summary: '모임 관련 게시글 조회' })
  @Get('meeting')
  async getMeetingPosts(): Promise<Community[]> {
    this.logger.log('Fetching meeting posts');
    return this.communityService.findByCategory(Category.MEETING);
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

    this.logger.log(`Fetching posts for category ${categoryEnum}`);
    const posts = await this.communityService.findByCategory(categoryEnum);
    this.logger.log(`Posts found: ${JSON.stringify(posts)}`);

    const post = posts.find((p) => p.post_id === id);
    if (!post) {
      this.logger.error(`Post with id ${id} not found in category ${category}`);
      throw new NotFoundException(`${category} 카테고리 내 게시글 ${id}를 찾을 수 없습니다.`);
    }

    this.logger.log(`Post found: ${JSON.stringify(post)}`);
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
    const post = await this.communityService.findOne(+id); // 문자열을 숫자로 변환
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
}
