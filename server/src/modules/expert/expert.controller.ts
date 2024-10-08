/**
 * File Name    : expert.controller.ts
 * Description  : expert 컨트롤러 로직
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.14    이승철      Created
 * 2024.09.14    이승철      Modified    ApiResponse 추가
 * 2024.09.16    이승철      Modified    절대경로 변경
 * 2024.09.19    이승철      Modified    ApiResponse 추가
 * 2024.09.21    이승철      Modified    응답 dto 추가
 * 2024.09.21    이승철      Modified    절대경로 변경
 * 2024.09.21    이승철      Modified    getExperts 반환타입 변경
 */

import { ExpertListResponseDto, ExpertResponseDto } from '@_modules/expert/dto/expert-response.dto';
import { ExpertService } from '@_modules/expert/expert.service';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ExpertPaginationQueryDto } from './dto/expert-pagination-query.dto';

@ApiTags('Expert')
@Controller('expert')
export class ExpertController {
  constructor(private readonly expertService: ExpertService) {}

  @ApiOperation({ summary: '전문가 리스트 조회', description: '페이지네이션을 적용한 전문가 리스트를 조회합니다.' })
  @ApiQuery({ type: ExpertPaginationQueryDto, description: '페이지 및 페이지 당 항목 수' })
  @ApiResponse({ status: 200, description: '성공적으로 전문가 리스트를 반환합니다.', type: ExpertListResponseDto })
  @ApiResponse({ status: 400, description: '잘못된 요청입니다.' })
  @Get()
  async getExperts(@Query() expertPaginationQueryDto: ExpertPaginationQueryDto): Promise<ExpertListResponseDto> {
    return this.expertService.getExperts(expertPaginationQueryDto);
  }

  @ApiOperation({ summary: '전문가 상세 조회', description: '특정 전문가의 상세 정보를 조회합니다.' })
  @ApiParam({ name: 'id', description: '전문가 ID', example: 1 })
  @ApiResponse({ status: 200, description: '성공적으로 전문가 상세 정보를 반환합니다.', type: ExpertResponseDto })
  @ApiResponse({ status: 404, description: '전문가를 찾을 수 없습니다.' })
  @Get(':id')
  async getExpertById(@Param('id') id: number): Promise<ExpertResponseDto> {
    return this.expertService.getExpertById(id);
  }
}
