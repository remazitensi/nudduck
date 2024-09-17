import { Jwt } from '@_modules/auth/guards/jwt';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { UserRequest } from 'common/interfaces/user-request.interface';
import { CreateLifeGraphDto } from './dto/create-life-graph.dto';
import { FavoriteLifeGraphDto } from './dto/favorite-life-graph.dto';
import { LifeGraphPageDto } from './dto/life-graph-page.dto';
import { UpdateLifeGraphDto } from './dto/update-life-graph.dto';
import { LifeGraph } from './entity/life-graph.entity';
import { LifeGraphService } from './life-graph.service';

@Controller('life-graph')
@UseGuards(Jwt)
export class LifeGraphController {
  constructor(private readonly lifeGraphService: LifeGraphService) {}

  @Post()
  async createLifeGraph(@Req() req: UserRequest, @Body() createLifeGraphDto: CreateLifeGraphDto) {
    await this.lifeGraphService.createNewLifeGraph(req.user.id, createLifeGraphDto);
    return { message: '인생그래프가 생성되었습니다.' };
  }

  @Get()
  async getAllLifeGraphs(@Req() req: UserRequest, @Query() lifeGraphPageDto: LifeGraphPageDto) {
    const limit = 6;
    return this.lifeGraphService.getAllLifeGraph(req.user.id, lifeGraphPageDto.page, limit);
  }

  @Get(':id')
  async getOneLifeGraph(@Param('id') id: number, @Req() req: UserRequest): Promise<LifeGraph> {
    const userId = req.user.id;
    const lifeGraph = await this.lifeGraphService.getOneLifeGraph(userId, id);
    return lifeGraph;
  }

  @Patch(':id')
  async updateLifeGraph(@Req() req: UserRequest, @Param('id') id: number, @Body() updateLifeGraphDto: UpdateLifeGraphDto) {
    await this.lifeGraphService.updateLifeGraph(req.user.id, id, updateLifeGraphDto);
    return { message: '인생그래프가 수정되었습니다.' };
  }

  @Delete(':id')
  async deleteLifeGraph(@Req() req: UserRequest, @Param('id') id: number): Promise<{ message: string }> {
    await this.lifeGraphService.deleteLifeGraph(req.user.id, id);
    return { message: '인생그래프가 삭제되었습니다.' };
  }

  @Post('favorite')
  async addFavorite(@Req() req: UserRequest, @Body() favoriteDto: FavoriteLifeGraphDto) {
    await this.lifeGraphService.toggleFavorite(req.user.id, favoriteDto.graphId);
    return { message: '인생그래프가 즐겨찾기에 등록되었습니다.' };
  }
}
