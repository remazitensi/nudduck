import { Controller, Get, Post, Patch, Delete, Param, Body, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';
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

  @ApiOperation({ summary: '게시글 생성' })
  @Post()
  async createPost(@Body() createCommunityDto: CreateCommunityDto): Promise<Community> {
    return this.communityService.createPost(createCommunityDto);
  }

  @ApiOperation({ summary: '게시글 조회' })
  @Get(':id')
  async getPostById(@Param('id', ParseIntPipe) id: number): Promise<Community> {
    return this.communityService.getPostById(id);
  }

  @ApiOperation({ summary: '게시글 수정' })
  @Patch(':id')
  async updatePost(@Param('id', ParseIntPipe) id: number, @Body() updateCommunityDto: UpdateCommunityDto): Promise<Community> {
    return this.communityService.updatePost(id, updateCommunityDto);
  }

  @ApiOperation({ summary: '게시글 삭제' })
  @Delete(':id')
  async deletePost(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.communityService.deletePost(id);
  }

  @ApiOperation({ summary: '전체 커뮤니티 게시글 목록 조회 (페이지네이션 지원)' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: '페이지 번호 (기본값: 1)' })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, description: '페이지 당 결과 수 (기본값: 10)' })
  @Get()
  async getAllPosts(@Query() paginationQuery: PaginationQueryDto): Promise<Community[]> {
    return this.communityService.getAllPosts(paginationQuery);
  }

  @ApiOperation({ summary: '카테고리별 게시글 조회 (페이지네이션 지원)' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: '페이지 번호 (기본값: 1)' })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, description: '페이지 당 결과 수 (기본값: 10)' })
  @Get(':category')
  async getPostsByCategory(@Param('category') category: Category, @Query() paginationQuery: PaginationQueryDto): Promise<Community[]> {
    return this.communityService.getPostsByCategory(category, paginationQuery);
  }

  @ApiOperation({ summary: '댓글 생성' })
  @Post(':postId/comments')
  async createComment(@Param('postId', ParseIntPipe) postId: number, @Body() createCommentDto: CreateCommentDto): Promise<Comment> {
    return this.communityService.createComment(postId, createCommentDto);
  }

  @ApiOperation({ summary: '댓글 수정' })
  @Patch(':postId/comments/:commentId')
  async updateComment(@Param('postId', ParseIntPipe) postId: number, @Param('commentId', ParseIntPipe) commentId: number, @Body() updateCommentDto: UpdateCommentDto): Promise<Comment> {
    return this.communityService.updateComment(postId, commentId, updateCommentDto);
  }

  @ApiOperation({ summary: '댓글 삭제' })
  @Delete(':postId/comments/:commentId')
  async deleteComment(@Param('postId', ParseIntPipe) postId: number, @Param('commentId', ParseIntPipe) commentId: number): Promise<void> {
    return this.communityService.deleteComment(postId, commentId);
  }

  @ApiOperation({ summary: '대댓글 생성' })
  @ApiParam({ name: 'postId', description: '게시글 ID', type: Number })
  @ApiParam({ name: 'parentId', description: '부모 댓글 ID', type: Number })
  @ApiBody({ type: CreateCommentDto })
  @Post(':postId/comments/:parentId/replies')
  async createReply(@Param('postId', ParseIntPipe) postId: number, @Param('parentId', ParseIntPipe) parentId: number, @Body() createCommentDto: CreateCommentDto): Promise<Comment> {
    return this.communityService.createReply(postId, parentId, createCommentDto);
  }

  @ApiOperation({ summary: '대댓글 수정' })
  @ApiParam({ name: 'postId', description: '게시글 ID', type: Number })
  @ApiParam({ name: 'commentId', description: '대댓글 ID', type: Number })
  @ApiBody({ type: UpdateCommentDto })
  @Patch(':postId/comments/:commentId/replies')
  async updateReply(@Param('postId', ParseIntPipe) postId: number, @Param('commentId', ParseIntPipe) commentId: number, @Body() updateCommentDto: UpdateCommentDto): Promise<Comment> {
    return this.communityService.updateReply(postId, commentId, updateCommentDto);
  }

  @ApiOperation({ summary: '대댓글 삭제' })
  @ApiParam({ name: 'postId', description: '게시글 ID', type: Number })
  @ApiParam({ name: 'commentId', description: '대댓글 ID', type: Number })
  @Delete(':postId/comments/:commentId/replies')
  async deleteReply(@Param('postId', ParseIntPipe) postId: number, @Param('commentId', ParseIntPipe) commentId: number): Promise<void> {
    return this.communityService.deleteReply(postId, commentId);
  }

  @ApiOperation({ summary: '댓글의 대댓글 조회' })
  @ApiParam({ name: 'postId', description: '게시글 ID', type: Number })
  @ApiParam({ name: 'commentId', description: '댓글 ID', type: Number })
  @Get(':postId/comments/:commentId/replies')
  async getReplies(@Param('postId', ParseIntPipe) postId: number, @Param('commentId', ParseIntPipe) commentId: number): Promise<Comment[]> {
    return this.communityService.getReplies(postId, commentId);
  }

  @ApiOperation({ summary: '게시글 좋아요 수 증가' })
  @Post(':id/likes')
  async incrementLikes(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.communityService.incrementLikes(id);
  }

  @ApiOperation({ summary: '게시글 좋아요 수 감소' })
  @Delete(':id/likes')
  async decrementLikes(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.communityService.decrementLikes(id);
  }

  @ApiOperation({ summary: '게시글 조회수 증가' })
  @Post(':id/views')
  async incrementViews(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.communityService.incrementViews(id);
  }
}
