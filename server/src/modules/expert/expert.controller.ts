/**
 * File Name    : expert.controller.ts
 * Description  : expert 컨트롤러 로직
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.14    이승철      Created
 */

import { ExpertPageDto } from '@_expert/dto/expert-page.dto';
import { Expert } from '@_expert/entity/expert.entity';
import { ExpertService } from '@_expert/expert.service';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('Expert')
@Controller('expert')
export class ExpertController {
  constructor(private readonly expertService: ExpertService) {}

  @Get()
  @ApiOperation({ summary: '전문가 리스트 조회', description: '페이지네이션을 적용한 전문가 리스트를 조회합니다.' })
  async getExperts(@Query() expertPageDto: ExpertPageDto): Promise<{ data: Expert[]; totalCount: number }> {
    const limit = 10; // 페이지 당 10개의 데이터 고정
    return this.expertService.getExperts(expertPageDto.page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: '전문가 상세 조회', description: '특정 전문가의 상세 정보를 조회합니다.' })
  @ApiParam({ name: 'id', description: '전문가 ID', example: 1 })
  async getExpertById(@Param('id') id: number): Promise<Expert> {
    return this.expertService.getExpertById(id);
  }
}
