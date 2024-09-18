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
 */

import { Jwt } from '@_modules/auth/guards/jwt';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { UserRequest } from 'common/interfaces/user-request.interface';
import { CreateLifeGraphDto } from '@_modules/life-graph/dto/create-life-graph.dto';
import { FavoriteLifeGraphDto } from '@_modules/life-graph/dto/favorite-life-graph.dto';
import { LifeGraphPageDto } from '@_modules/life-graph/dto/life-graph-page.dto';
import { UpdateLifeGraphDto } from '@_modules/life-graph/dto/update-life-graph.dto';
import { LifeGraph } from '@_modules/life-graph/entity/life-graph.entity';
import { LifeGraphService } from '@_modules/life-graph/life-graph.service';

@Controller('life-graph')
@UseGuards(Jwt)
export class LifeGraphController {
  constructor(private readonly lifeGraphService: LifeGraphService) {}

  @Post()
  async createLifeGraph(@Req() req: UserRequest, @Body() createLifeGraphDto: CreateLifeGraphDto): Promise<{ message: string }> {
    await this.lifeGraphService.createNewLifeGraph(req.user.id, createLifeGraphDto);
    return { message: '인생그래프가 생성되었습니다.' };
  }

  @Get()
  async getAllLifeGraphs(@Req() req: UserRequest, @Query() lifeGraphPageDto: LifeGraphPageDto): Promise<{ data: LifeGraph[]; totalCount: number }> {
    const limit = 6;
    return await this.lifeGraphService.getAllLifeGraph(req.user.id, lifeGraphPageDto.page, limit);
  }

  @Get(':id')
  async getOneLifeGraph(@Param('id') id: number, @Req() req: UserRequest): Promise<LifeGraph> {
    const userId = req.user.id;
    return await this.lifeGraphService.getOneLifeGraph(userId, id);
  }

  @Patch(':id')
  async updateLifeGraph(@Req() req: UserRequest, @Param('id') id: number, @Body() updateLifeGraphDto: UpdateLifeGraphDto): Promise<{ message: string }> {
    await this.lifeGraphService.updateLifeGraph(req.user.id, id, updateLifeGraphDto);
    return { message: '인생그래프가 수정되었습니다.' };
  }

  @Delete(':id')
  async deleteLifeGraph(@Req() req: UserRequest, @Param('id') id: number): Promise<{ message: string }> {
    await this.lifeGraphService.deleteLifeGraph(req.user.id, id);
    return { message: '인생그래프가 삭제되었습니다.' };
  }

  @Post('favorite')
  async addFavorite(@Req() req: UserRequest, @Body() favoriteDto: FavoriteLifeGraphDto): Promise<{ message: string }> {
    await this.lifeGraphService.toggleFavorite(req.user.id, favoriteDto.graphId);
    return { message: '인생그래프가 즐겨찾기에 등록되었습니다.' };
  }
}
