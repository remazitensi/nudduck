import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiParam, ApiQuery } from '@nestjs/swagger';

@ApiTags('Expert')
@Controller('expert')
export class ExpertController {
  @ApiOperation({ summary: '전문가 리스트 조회' })
  @ApiQuery({ name: 'page', required: false, description: '페이지 번호' })
  @Get()
  getExperts(@Query('page') page: number) {
    // 실제 구현 로직
    return '전문가 리스트';
  }

  @ApiOperation({ summary: '특정 전문가 상세 정보 조회' })
  @ApiParam({ name: 'id', description: '전문가 ID' })
  @Get(':id')
  getExpertById(@Param('id') id: string) {
    // 실제 구현 로직
    return '전문가 상세 정보';
  }
}
