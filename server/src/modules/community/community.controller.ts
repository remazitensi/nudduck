import { Controller, Post, Body, UseGuards, Get, Param, Query, Delete, Patch, Request, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
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

@ApiTags('community')
@Controller('community')
export class CommunityController {
  constructor(
    private readonly communityService: CommunityService,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {}

  // 게시글 생성
  @UseGuards(Jwt)
  @Post()
  @ApiOperation({ summary: '게시글 생성' })
  @ApiResponse({ status: 201, description: '게시글이 성공적으로 생성되었습니다.' })
  @ApiResponse({ status: 400, description: '잘못된 요청입니다.' })
  async createPost(@Body() createCommunityDto: CreateCommunityDto, @Request() req: UserRequest): Promise<void> {
    const userId = req.user.id;
    return await this.communityService.createPost(createCommunityDto, userId);
  }

  // 게시글 조회
  @Get(':id')
  @ApiOperation({ summary: '게시글 조회' })
  @ApiParam({ name: 'id', required: true, description: '게시글 ID' })
  @ApiResponse({ status: 200, description: '게시글을 성공적으로 조회했습니다.', type: CommunityResponseDto })
  @ApiResponse({ status: 404, description: '게시글을 찾을 수 없습니다.' })
  async findPostById(@Param('id') postId: number): Promise<CommunityResponseDto> {
    const post = await this.communityService.findPostById(postId);
    if (!post) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.'); // 게시글이 없을 경우 예외 발생
    }
    return new CommunityResponseDto(post);
  }

  // 게시글 수정
  @UseGuards(Jwt)
  @Patch(':id')
  @ApiOperation({ summary: '게시글 수정' })
  @ApiParam({ name: 'id', required: true, description: '게시글 ID' })
  @ApiResponse({ status: 204, description: '게시글이 성공적으로 수정되었습니다.' })
  @ApiResponse({ status: 400, description: '잘못된 요청입니다.' })
  @ApiResponse({ status: 404, description: '게시글을 찾을 수 없습니다.' })
  async updatePost(@Param('id') postId: number, @Body() updateCommunityDto: UpdateCommunityDto, @Request() req: UserRequest): Promise<void> {
    const userId = req.user.id;
    return await this.communityService.updatePost(postId, updateCommunityDto, userId);
  }

  // 게시글 삭제
  @UseGuards(Jwt)
  @Delete(':id')
  @ApiOperation({ summary: '게시글 삭제' })
  @ApiParam({ name: 'id', required: true, description: '게시글 ID' })
  @ApiResponse({ status: 204, description: '게시글이 성공적으로 삭제되었습니다.' })
  @ApiResponse({ status: 404, description: '게시글을 찾을 수 없습니다.' })
  async deletePost(@Param('id') postId: number, @Request() req: UserRequest): Promise<void> {
    const userId = req.user.id;
    return await this.communityService.deletePost(postId, userId);
  }

  // 게시글 목록 조회 (페이지네이션)
  @Get()
  @ApiOperation({ summary: '게시글 목록 조회 (페이지네이션)' })
  @ApiQuery({ name: 'page', required: false, description: '페이지 번호', type: Number })
  @ApiQuery({ name: 'limit', required: false, description: '페이지 당 게시글 수', type: Number })
  @ApiResponse({ status: 200, description: '게시글 목록을 성공적으로 조회했습니다.', type: [CommunityResponseDto] })
  async findAll(@Query() paginationQuery: PaginationQueryDto): Promise<[CommunityResponseDto[], number]> {
    return await this.communityService.findAll(paginationQuery);
  }

  // 카테고리별 게시글 조회 (페이지네이션)
  @Get('category/:category')
  @ApiOperation({ summary: '카테고리별 게시글 조회 (페이지네이션)' })
  @ApiParam({ name: 'category', required: true, description: '카테고리 이름' })
  @ApiQuery({ name: 'page', required: false, description: '페이지 번호', type: Number })
  @ApiQuery({ name: 'limit', required: false, description: '페이지 당 게시글 수', type: Number })
  @ApiResponse({ status: 200, description: '카테고리별 게시글 목록을 성공적으로 조회했습니다.', type: [CommunityResponseDto] })
  async findByCategory(@Param('category') category: string, @Query() paginationQuery: PaginationQueryDto): Promise<[CommunityResponseDto[], number]> {
    return await this.communityService.findByCategory(category, paginationQuery);
  }

  // 댓글 생성
  @UseGuards(Jwt)
  @Post(':postId/comments')
  @ApiOperation({ summary: '댓글 생성' })
  @ApiParam({ name: 'postId', required: true, description: '게시글 ID' })
  @ApiResponse({ status: 201, description: '댓글이 성공적으로 생성되었습니다.' })
  @ApiResponse({ status: 404, description: '게시글을 찾을 수 없습니다.' })
  async createComment(@Param('postId') postId: number, @Body() createCommentDto: CreateCommentDto, @Request() req: UserRequest): Promise<void> {
    const userId = req.user.id;
    return await this.communityService.createComment(postId, createCommentDto, userId, this.entityManager);
  }

  // 댓글 수정
  @UseGuards(Jwt)
  @Patch(':postId/comments/:commentId')
  @ApiOperation({ summary: '댓글 수정' })
  @ApiParam({ name: 'postId', required: true, description: '게시글 ID' })
  @ApiParam({ name: 'commentId', required: true, description: '댓글 ID' })
  @ApiResponse({ status: 204, description: '댓글이 성공적으로 수정되었습니다.' })
  @ApiResponse({ status: 404, description: '댓글 또는 게시글을 찾을 수 없습니다.' })
  async updateComment(@Param('postId') postId: number, @Param('commentId') commentId: number, @Body() updateCommentDto: UpdateCommentDto, @Request() req: UserRequest): Promise<void> {
    const userId = req.user.id;
    return await this.communityService.updateComment(commentId, updateCommentDto, userId);
  }

  // 댓글 삭제
  @UseGuards(Jwt)
  @Delete(':postId/comments/:commentId')
  @ApiOperation({ summary: '댓글 삭제' })
  @ApiParam({ name: 'postId', required: true, description: '게시글 ID' })
  @ApiParam({ name: 'commentId', required: true, description: '댓글 ID' })
  @ApiResponse({ status: 204, description: '댓글이 성공적으로 삭제되었습니다.' })
  @ApiResponse({ status: 404, description: '댓글 또는 게시글을 찾을 수 없습니다.' })
  async deleteComment(@Param('postId') postId: number, @Param('commentId') commentId: number, @Request() req: UserRequest): Promise<void> {
    const userId = req.user.id;
    return await this.communityService.deleteComment(commentId, userId);
  }

  // 대댓글 생성
  @UseGuards(Jwt)
  @Post(':postId/comments/:parentId/replies')
  @ApiOperation({ summary: '대댓글 생성' })
  @ApiParam({ name: 'postId', required: true, description: '게시글 ID' })
  @ApiParam({ name: 'parentId', required: true, description: '부모 댓글 ID' })
  @ApiResponse({ status: 201, description: '대댓글이 성공적으로 생성되었습니다.' })
  @ApiResponse({ status: 404, description: '게시글 또는 부모 댓글을 찾을 수 없습니다.' })
  async createReply(@Param('postId') postId: number, @Param('parentId') parentId: number, @Body() createCommentDto: CreateCommentDto, @Request() req: UserRequest): Promise<void> {
    const userId = req.user.id;
    return await this.communityService.createReply(parentId, createCommentDto, userId, this.entityManager);
  }

  // 대댓글 수정
  @UseGuards(Jwt)
  @Patch(':postId/comments/:commentId/replies')
  @ApiOperation({ summary: '대댓글 수정' })
  @ApiParam({ name: 'postId', required: true, description: '게시글 ID' })
  @ApiParam({ name: 'commentId', required: true, description: '부모 댓글 ID' })
  @ApiResponse({ status: 204, description: '대댓글이 성공적으로 수정되었습니다.' })
  @ApiResponse({ status: 404, description: '게시글 또는 댓글을 찾을 수 없습니다.' })
  async updateReply(@Param('postId') postId: number, @Param('commentId') commentId: number, @Body() updateCommentDto: UpdateCommentDto, @Request() req: UserRequest): Promise<void> {
    const userId = req.user.id;
    return await this.communityService.updateReply(commentId, updateCommentDto, userId);
  }

  // 대댓글 삭제
  @UseGuards(Jwt)
  @Delete(':postId/comments/:commentId/replies')
  @ApiOperation({ summary: '대댓글 삭제' })
  @ApiParam({ name: 'postId', required: true, description: '게시글 ID' })
  @ApiParam({ name: 'commentId', required: true, description: '대댓글 ID' })
  @ApiResponse({ status: 204, description: '대댓글이 성공적으로 삭제되었습니다.' })
  @ApiResponse({ status: 404, description: '게시글 또는 대댓글을 찾을 수 없습니다.' })
  async deleteReply(@Param('postId') postId: number, @Param('commentId') commentId: number, @Request() req: UserRequest): Promise<void> {
    const userId = req.user.id;
    return await this.communityService.deleteReply(commentId, userId);
  }

  // 댓글 목록 조회 (무한 스크롤)
  @Get(':postId/comments')
  @ApiOperation({ summary: '댓글 목록 조회 (무한 스크롤)' })
  @ApiParam({ name: 'postId', required: true, description: '게시글 ID' })
  @ApiQuery({ name: 'offset', required: true, description: '시작 인덱스', type: Number })
  @ApiQuery({ name: 'limit', required: true, description: '가져올 댓글 수', type: Number })
  @ApiResponse({ status: 200, description: '댓글 목록을 성공적으로 조회했습니다.', type: [CommentResponseDto] })
  @ApiResponse({ status: 404, description: '댓글을 찾을 수 없습니다.' })
  async getComments(@Param('postId') postId: number, @Query() paginationQuery: PaginationQueryDto): Promise<CommentResponseDto[]> {
    const comments = await this.communityService.getCommentsWithReplies(postId, paginationQuery);
    if (!comments.length) {
      throw new NotFoundException('댓글을 찾을 수 없습니다.');
    }
    return comments;
  }

  // 대댓글 목록 조회
  @Get(':postId/comments/:commentId/replies')
  @ApiOperation({ summary: '특정 댓글에 대한 대댓글 목록 조회' })
  @ApiParam({ name: 'postId', required: true, description: '게시글 ID' })
  @ApiParam({ name: 'commentId', required: true, description: '댓글 ID' })
  @ApiQuery({ name: 'offset', required: true, description: '시작 인덱스', type: Number })
  @ApiQuery({ name: 'limit', required: true, description: '가져올 대댓글 수', type: Number })
  @ApiResponse({ status: 200, description: '대댓글 목록을 성공적으로 조회했습니다.', type: [CommentResponseDto] })
  @ApiResponse({ status: 404, description: '대댓글을 찾을 수 없습니다.' })
  async getRepliesByCommentId(@Param('postId') postId: number, @Param('commentId') commentId: number, @Query() paginationQuery: PaginationQueryDto): Promise<CommentResponseDto[]> {
    const replies = await this.communityService.getRepliesByCommentId(commentId, paginationQuery);
    if (!replies.length) {
      throw new NotFoundException('대댓글을 찾을 수 없습니다.');
    }
    return replies;
  }

  // 게시글 조회수 증가
  @Post(':id/views')
  @ApiOperation({ summary: '게시글 조회수 증가' })
  @ApiParam({ name: 'id', required: true, description: '게시글 ID' })
  @ApiResponse({ status: 204, description: '게시글 조회수가 성공적으로 증가했습니다.' })
  @ApiResponse({ status: 404, description: '게시글을 찾을 수 없습니다.' })
  async incrementViewCount(@Param('id') postId: number): Promise<void> {
    return await this.communityService.incrementViewCount(postId);
  }
}
