/**
 * File Name    : life-graph.controller.ts
 * Description  : life-graph 컨트롤러 로직
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.17    이승철      Created
 * 2024.09.17    이승철      절대경로로 변경
 * 2024.09.18    이승철      메서드 반환타입 추가
 * 2024.09.18    이승철      인생그래프 즐겨찾기 이름 변경
 * 2024.09.19    이승철      api tag 추가
 * 2024.09.21    이승철      Modified    응답 dto 추가
 */

import { Jwt } from '@_modules/auth/guards/jwt';
import { CreateLifeGraphDto } from '@_modules/life-graph/dto/create-life-graph.dto';
import { FavoriteLifeGraphDto } from '@_modules/life-graph/dto/favorite-life-graph.dto';
import { LifeGraphPageDto } from '@_modules/life-graph/dto/life-graph-page.dto';
import { UpdateLifeGraphDto } from '@_modules/life-graph/dto/update-life-graph.dto';
import { LifeGraphService } from '@_modules/life-graph/life-graph.service';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserRequest } from 'common/interfaces/user-request.interface';
import { LifeGraphListResponseDto, LifeGraphResponseDto } from './dto/life-graph-response.dto';

@ApiTags('life-graph')
@Controller('life-graph')
@UseGuards(Jwt)
export class LifeGraphController {
  constructor(private readonly lifeGraphService: LifeGraphService) {}

  @ApiOperation({ summary: '인생 그래프 생성', description: '새로운 인생 그래프를 생성합니다.' })
  @ApiBody({ type: CreateLifeGraphDto, description: '인생 그래프 생성 요청 데이터' })
  @ApiResponse({ status: 201, description: '인생 그래프가 성공적으로 생성되었습니다.' })
  @ApiResponse({ status: 400, description: '잘못된 요청입니다.' })
  @Post()
  async createLifeGraph(@Req() req: UserRequest, @Body() createLifeGraphDto: CreateLifeGraphDto): Promise<{ message: string }> {
    await this.lifeGraphService.createNewLifeGraph(req.user.id, createLifeGraphDto);
    return { message: '인생그래프가 생성되었습니다.' };
  }

  @ApiOperation({ summary: '인생 그래프 목록 조회', description: '페이지네이션을 적용하여 인생 그래프 목록을 조회합니다.' })
  @ApiQuery({ type: LifeGraphPageDto, description: '페이지 번호 (기본값: 1)' })
  @ApiResponse({ status: 200, description: '성공적으로 인생 그래프 목록을 반환합니다.', type: LifeGraphListResponseDto })
  @ApiResponse({ status: 400, description: '잘못된 요청입니다.' })
  @Get()
  async getAllLifeGraphs(@Req() req: UserRequest, @Query() lifeGraphPageDto: LifeGraphPageDto): Promise<LifeGraphListResponseDto> {
    const limit = 6;
    return await this.lifeGraphService.getAllLifeGraph(req.user.id, lifeGraphPageDto.page, limit);
  }

  @ApiOperation({ summary: '특정 인생 그래프 조회', description: 'ID를 기반으로 특정 인생 그래프를 조회합니다.' })
  @ApiParam({ name: 'id', description: '인생 그래프 ID', example: 1 })
  @ApiResponse({ status: 200, description: '성공적으로 인생 그래프를 반환합니다.', type: LifeGraphResponseDto })
  @ApiResponse({ status: 404, description: '인생 그래프를 찾을 수 없습니다.' })
  @Get(':id')
  async getOneLifeGraph(@Param('id') id: number, @Req() req: UserRequest): Promise<LifeGraphResponseDto> {
    const userId = req.user.id;
    return await this.lifeGraphService.getOneLifeGraph(userId, id);
  }

  @ApiOperation({ summary: '인생 그래프 수정', description: '기존의 인생 그래프를 수정합니다.' })
  @ApiParam({ name: 'id', description: '인생 그래프 ID', example: 1 })
  @ApiResponse({ status: 200, description: '성공적으로 인생 그래프가 수정되었습니다.' })
  @ApiResponse({ status: 404, description: '인생 그래프를 찾을 수 없습니다.' })
  @Patch(':id')
  async updateLifeGraph(@Req() req: UserRequest, @Param('id') id: number, @Body() updateLifeGraphDto: UpdateLifeGraphDto): Promise<{ message: string }> {
    await this.lifeGraphService.updateLifeGraph(req.user.id, id, updateLifeGraphDto);
    return { message: '인생그래프가 수정되었습니다.' };
  }

  @ApiOperation({ summary: '인생 그래프 삭제', description: '특정 인생 그래프를 삭제합니다.' })
  @ApiParam({ name: 'id', description: '인생 그래프 ID', example: 1 })
  @ApiResponse({ status: 200, description: '성공적으로 인생 그래프가 삭제되었습니다.' })
  @ApiResponse({ status: 404, description: '인생 그래프를 찾을 수 없습니다.' })
  @Delete(':id')
  async deleteLifeGraph(@Req() req: UserRequest, @Param('id') id: number): Promise<{ message: string }> {
    await this.lifeGraphService.deleteLifeGraph(req.user.id, id);
    return { message: '인생그래프가 삭제되었습니다.' };
  }

  @ApiOperation({ summary: '인생 그래프 즐겨찾기 등록', description: '특정 인생 그래프를 즐겨찾기에 등록합니다.' })
  @ApiBody({ type: FavoriteLifeGraphDto, description: '즐겨찾기할 그래프 ID 정보' })
  @ApiResponse({ status: 200, description: '성공적으로 인생 그래프가 즐겨찾기에 등록되었습니다.' })
  @ApiResponse({ status: 404, description: '인생 그래프를 찾을 수 없습니다.' })
  @Post('favorite')
  async createFavoriteLifeGraph(@Req() req: UserRequest, @Body() favoriteDto: FavoriteLifeGraphDto): Promise<{ message: string }> {
    await this.lifeGraphService.createFavoriteLifeGraph(req.user.id, favoriteDto.graphId);
    return { message: '인생그래프가 즐겨찾기에 등록되었습니다.' };
  }
}
