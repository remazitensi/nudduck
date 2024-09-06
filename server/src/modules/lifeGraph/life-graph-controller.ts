import { Controller, Post, Get, Patch, Delete, Param, Body } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiParam } from '@nestjs/swagger';
import { CreateLifeGraphDto } from './dto/create-life-graph.dto';
import { UpdateLifeGraphDto } from './dto/update-life-graph.dto';

@ApiTags('LifeGraph')
@Controller('life-graph')
export class LifeGraphController {
  @ApiOperation({ summary: '인생그래프 생성' })
  @Post()
  createLifeGraph(@Body() createLifeGraphDto: CreateLifeGraphDto) {
    // 구현 로직 추가
    return '인생그래프 생성';
  }

  @ApiOperation({ summary: '인생그래프 조회' })
  @ApiParam({ name: 'id', description: '인생그래프 ID' })
  @Get(':id')
  getLifeGraphById(@Param('id') id: string) {
    // 구현 로직 추가
    return '인생그래프 조회';
  }

  @ApiOperation({ summary: '인생그래프 수정' })
  @ApiParam({ name: 'id', description: '인생그래프 ID' })
  @Patch(':id')
  updateLifeGraph(@Param('id') id: string, @Body() updateLifeGraphDto: UpdateLifeGraphDto) {
    // 구현 로직 추가
    return '인생그래프 수정';
  }

  @ApiOperation({ summary: '인생그래프 삭제' })
  @ApiParam({ name: 'id', description: '인생그래프 ID' })
  @Delete(':id')
  deleteLifeGraph(@Param('id') id: string) {
    // 구현 로직 추가
    return '인생그래프 삭제';
  }
}
