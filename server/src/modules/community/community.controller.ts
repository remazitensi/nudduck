/**
 * File Name    : community.controller.ts
 * Description  : 커뮤니티 컨트롤러
 * Author       : 김재영
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.07    김재영      Created     커뮤니티 컨트롤러 초기 생성
 * 2024.09.09    김재영      Modified    게시글 CRUD API 메서드 구현
 */

import { Controller, Get, Post, Put, Delete, Param, Body, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CommunityService } from './community.service';
import { CreateCommunityDto } from './dto/create-community.dto';
import { UpdateCommunityDto } from './dto/update-community.dto';
import { Community } from './entities/community.entity';
import { Category } from './enums/category.enum'; // 필요시 Category enum 경로 수정

@ApiTags('Community')
@Controller('community')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  @ApiOperation({ summary: '전체 커뮤니티 게시글 목록 조회' })
  @Get()
  async getAllPosts(): Promise<Community[]> {
    return this.communityService.findAll();
  }

  @ApiOperation({ summary: '면접 관련 게시글 조회' })
  @Get('interview')
  async getInterviewPosts(): Promise<Community[]> {
    return this.communityService.findByCategory(Category.INTERVIEW); // 카테고리 enum 값 사용
  }

  @ApiOperation({ summary: '스터디 관련 게시글 조회' })
  @Get('study')
  async getStudyPosts(): Promise<Community[]> {
    return this.communityService.findByCategory(Category.STUDY); // 카테고리 enum 값 사용
  }

  @ApiOperation({ summary: '잡담 관련 게시글 조회' })
  @Get('talk')
  async getChatPosts(): Promise<Community[]> {
    return this.communityService.findByCategory(Category.TALK); // 카테고리 enum 값 사용
  }

  @ApiOperation({ summary: '모임 관련 게시글 조회' })
  @Get('meeting')
  async getMeetingPosts(): Promise<Community[]> {
    return this.communityService.findByCategory(Category.MEETING); // 카테고리 enum 값 사용
  }

  @ApiOperation({ summary: '게시글 작성' })
  @Post()
  async createPost(@Body() createCommunityDto: CreateCommunityDto): Promise<Community> {
    return this.communityService.create(createCommunityDto);
  }

  @ApiOperation({ summary: '게시글 조회' })
  @Get(':id')
  async getPostById(@Param('id') id: string): Promise<Community> {
    const post = await this.communityService.findOne(+id); // 문자열을 숫자로 변환
    if (!post) {
      throw new NotFoundException(`게시글 ID ${id}를 찾을 수 없습니다.`);
    }
    return post;
  }

  @ApiOperation({ summary: '게시글 수정' })
  @Put(':id')
  async updatePost(@Param('id') id: string, @Body() updateCommunityDto: UpdateCommunityDto): Promise<Community> {
    const updatedPost = await this.communityService.update(+id, updateCommunityDto); // 문자열을 숫자로 변환
    if (!updatedPost) {
      throw new NotFoundException(`게시글 ID ${id}를 수정할 수 없습니다.`);
    }
    return updatedPost;
  }

  @ApiOperation({ summary: '게시글 삭제' })
  @Delete(':id')
  async deletePost(@Param('id') id: string): Promise<void> {
    const exists = await this.communityService.findOne(+id); // 문자열을 숫자로 변환
    if (!exists) {
      throw new NotFoundException(`게시글 ${id}를 삭제할 수 없습니다.`);
    }
    await this.communityService.remove(+id); // 문자열을 숫자로 변환
  }
}
