import { Controller, Post, Body, UseGuards, Get, Param, Query, Delete, Patch, Request } from '@nestjs/common';
import { CommunityService } from './community.service';
import { CreateCommunityDto } from '@_modules/community/dto/request/create-community.dto';
import { UpdateCommunityDto } from '@_modules/community/dto/request/update-community.dto';
import { CreateCommentDto } from '@_modules/community/dto/request/create-comment.dto';
import { UpdateCommentDto } from '@_modules/community/dto/request/update-comment.dto';
import { PaginationQueryDto } from '@_modules/community/dto/request/pagination-query.dto';
import { CommunityResponseDto } from '@_modules/community/dto/response/community-response.dto';
import { CommentResponseDto } from '@_modules/community/dto/response/comment-response.dto';
import { Jwt } from '@_modules/auth/guards/jwt';
import { UserRequest } from 'common/interfaces/user-request.interface';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

@Controller('community')
export class CommunityController {
  constructor(
    private readonly communityService: CommunityService,
    @InjectEntityManager() private readonly entityManager: EntityManager, // Inject EntityManager
  ) {}

  // 게시글 생성
  @UseGuards(Jwt)
  @Post()
  async createPost(@Body() createCommunityDto: CreateCommunityDto, @Request() req: UserRequest): Promise<void> {
    const userId = req.user.id;
    return await this.communityService.createPost(createCommunityDto, userId);
  }

  // 게시글 조회
  @Get(':id')
  async findPostById(@Param('id') postId: number): Promise<CommunityResponseDto> {
    const post = await this.communityService.findPostById(postId);
    return new CommunityResponseDto(post);
  }

  // 게시글 수정
  @UseGuards(Jwt)
  @Patch(':id')
  async updatePost(@Param('id') postId: number, @Body() updateCommunityDto: UpdateCommunityDto, @Request() req: UserRequest): Promise<void> {
    const userId = req.user.id;
    return await this.communityService.updatePost(postId, updateCommunityDto, userId);
  }

  // 게시글 삭제
  @UseGuards(Jwt)
  @Delete(':id')
  async deletePost(@Param('id') postId: number, @Request() req: UserRequest): Promise<void> {
    const userId = req.user.id;
    return await this.communityService.deletePost(postId, userId);
  }

  // 게시글 목록 조회 (페이지네이션)
  @Get()
  async findAll(@Query() paginationQuery: PaginationQueryDto): Promise<[CommunityResponseDto[], number]> {
    return await this.communityService.findAll(paginationQuery);
  }

  // 카테고리별 게시글 조회 (페이지네이션)
  @Get('category/:category')
  async findByCategory(@Param('category') category: string, @Query() paginationQuery: PaginationQueryDto): Promise<[CommunityResponseDto[], number]> {
    return await this.communityService.findByCategory(category, paginationQuery);
  }

  // 댓글 생성
  @UseGuards(Jwt)
  @Post(':postId/comments')
  async createComment(@Param('postId') postId: number, @Body() createCommentDto: CreateCommentDto, @Request() req: UserRequest): Promise<void> {
    const userId = req.user.id;
    return await this.communityService.createComment(postId, createCommentDto, userId, this.entityManager);
  }

  // 댓글 수정
  @UseGuards(Jwt)
  @Patch(':postId/comments/:commentId')
  async updateComment(@Param('postId') postId: number, @Param('commentId') commentId: number, @Body() updateCommentDto: UpdateCommentDto, @Request() req: UserRequest): Promise<void> {
    const userId = req.user.id;
    return await this.communityService.updateComment(commentId, updateCommentDto, userId);
  }

  // 댓글 삭제
  @UseGuards(Jwt)
  @Delete(':postId/comments/:commentId')
  async deleteComment(@Param('postId') postId: number, @Param('commentId') commentId: number, @Request() req: UserRequest): Promise<void> {
    const userId = req.user.id;
    return await this.communityService.deleteComment(commentId, userId);
  }

  // 대댓글 생성
  @UseGuards(Jwt)
  @Post(':postId/comments/:parentId/replies')
  async createReply(@Param('postId') postId: number, @Param('parentId') parentId: number, @Body() createCommentDto: CreateCommentDto, @Request() req: UserRequest): Promise<void> {
    const userId = req.user.id;
    return await this.communityService.createReply(parentId, createCommentDto, userId, this.entityManager);
  }

  // 대댓글 수정
  @UseGuards(Jwt)
  @Patch(':postId/comments/:commentId/replies')
  async updateReply(@Param('postId') postId: number, @Param('commentId') commentId: number, @Body() updateCommentDto: UpdateCommentDto, @Request() req: UserRequest): Promise<void> {
    const userId = req.user.id;
    return await this.communityService.updateReply(commentId, updateCommentDto, userId);
  }

  // 대댓글 삭제
  @UseGuards(Jwt)
  @Delete(':postId/comments/:commentId/replies')
  async deleteReply(@Param('postId') postId: number, @Param('commentId') commentId: number, @Request() req: UserRequest): Promise<void> {
    const userId = req.user.id;
    return await this.communityService.deleteReply(commentId, userId);
  }

  // 특정 댓글에 대한 대댓글 목록 조회
  @Get(':postId/comments/:commentId/replies')
  async getRepliesByCommentId(@Param('postId') postId: number, @Param('commentId') commentId: number, @Query() paginationQuery: PaginationQueryDto): Promise<CommentResponseDto[]> {
    return await this.communityService.getRepliesByCommentId(commentId, paginationQuery);
  }

  // 게시글 조회수 증가
  @Post(':id/views')
  async incrementViewCount(@Param('id') postId: number): Promise<void> {
    return await this.communityService.incrementViewCount(postId);
  }
}
