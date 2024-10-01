/**
 * File Name    : life-graph.repository.ts
 * Description  : life-graph repository 로직
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.17    이승철      Created
 * 2024.09.18    이승철      Modified    트랜잭션에서 직접 db처리로 인해 update 로직 삭제
 * 2024.09.24    이승철      Modified    카멜케이스로 변경
 * 2024.09.29    이승철      Modified    return 타입 추가
 */

import { LifeGraph } from '@_modules/life-graph/entity/life-graph.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class LifeGraphRepository {
  constructor(
    @InjectRepository(LifeGraph)
    private readonly lifeGraphRepository: Repository<LifeGraph>,
  ) {}

  async createLifeGraph(newLifeGraphDto: Partial<LifeGraph>): Promise<LifeGraph> {
    const newLifeGraph = this.lifeGraphRepository.create({
      ...newLifeGraphDto,
    });

    return this.lifeGraphRepository.save(newLifeGraph);
  }

  async findLifeGraphs(userId: number, page: number, limit: number): Promise<LifeGraph[]> {
    return this.lifeGraphRepository.find({
      where: { user: { id: userId } },
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
      relations: ['events'],
    });
  }

  async countLifeGraphs(userId: number): Promise<number> {
    return this.lifeGraphRepository.count({ where: { user: { id: userId } } });
  }

  async findOneLifeGraph(userId: number, graphId: number, options?: { relations?: string[] }): Promise<LifeGraph | null> {
    return this.lifeGraphRepository.findOne({
      where: { id: graphId, user: { id: userId } },
      relations: options?.relations || [],
    });
  }

  async deleteLifeGraph(lifeGraph: LifeGraph): Promise<void> {
    await this.lifeGraphRepository.remove(lifeGraph);
  }
}
