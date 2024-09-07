import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Community')
@Controller('community')
export class CommunityController {
  @ApiOperation({ summary: '커뮤니티 게시글 목록 조회' })
  @Get()
  getPosts() {
    return { message: '게시글 목록' };
  }

  @ApiOperation({ summary: '게시글 작성' })
  @Post()
  createPost() {
    return { message: '게시글 작성' };
  }

  @ApiOperation({ summary: '게시글 조회' })
  @Get(':id')
  getPost(@Param('id') id: string) {
    return { message: `게시글 ${id} 조회` };
  }

  @ApiOperation({ summary: '게시글 수정' })
  @Put(':id')
  updatePost(@Param('id') id: string) {
    return { message: `게시글 ${id} 수정` };
  }

  @ApiOperation({ summary: '게시글 삭제' })
  @Delete(':id')
  deletePost(@Param('id') id: string) {
    return { message: `게시글 ${id} 삭제` };
  }
}
