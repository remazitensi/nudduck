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

  async updateLifeGraph(lifeGraph: LifeGraph) {
    return this.lifeGraphRepository.save(lifeGraph);
  }

  async findLifeGraphs(userId: number, page: number, limit: number) {
    return this.lifeGraphRepository.find({
      where: { user: { id: userId } },
      skip: (page - 1) * limit,
      take: limit,
      order: { created_at: 'DESC' },
      relations: ['events'],
    });
  }

  async countLifeGraphs(userId: number) {
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
