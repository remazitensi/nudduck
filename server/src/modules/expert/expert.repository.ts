/**
 * File Name    : expert.repository.ts
 * Description  : expert repository
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.14    이승철      Created
 */

import { Expert } from '@_expert/entity/expert.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ExpertRepository {
  constructor(
    @InjectRepository(Expert)
    private readonly expertRepository: Repository<Expert>,
  ) {}

  // 전문가 리스트 조회 (페이지네이션 적용)
  async findExperts(page: number, limit: number): Promise<Expert[]> {
    return await this.expertRepository.find({
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  // 전체 전문가 수만 조회
  async findTotalCount(): Promise<number> {
    const totalCount = await this.expertRepository.count();
    return totalCount;
  }

  // ID로 전문가 상세 조회
  async findExpertById(id: number): Promise<Expert> {
    return this.expertRepository.findOne({ where: { id } });
  }
}
