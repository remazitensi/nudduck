/**
 * File Name    : expert.service.ts
 * Description  : expert 서비스 로직
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.14    이승철      Created
 * 2024.09.16    이승철      Modified    절대경로 변경, InjectRepository decorator를 사용해서 service에 주입
 */

import { Expert } from '@_modules/expert/entity/expert.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ExpertService {
  constructor(
    @InjectRepository(Expert) // 여기서 직접 Repository를 주입받음
    private readonly expertRepository: Repository<Expert>,
  ) {}

  // 전문가 리스트 조회 (페이지네이션 적용)
  async getExperts(page: number, limit: number): Promise<{ data: Expert[]; totalCount: number }> {
    page = Math.max(page, 1);
    const totalCount = await this.expertRepository.count();
    const totalPages = Math.ceil(totalCount / limit);

    if (page > totalPages) {
      page = totalPages;
    }

    const data = await this.expertRepository.find({
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, totalCount };
  }

  // 전문가 상세 조회
  async getExpertById(id: number): Promise<Expert> {
    return this.expertRepository.findOne({ where: { id } });
  }
}
