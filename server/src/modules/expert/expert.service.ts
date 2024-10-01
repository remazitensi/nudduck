/**
 * File Name    : expert.service.ts
 * Description  : expert 서비스 로직
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.14    이승철      Created
 * 2024.09.16    이승철      Modified    절대경로 변경, InjectRepository decorator를 사용해서 service에 주입
 * 2024.09.24    이승철      Modified    limit를 dto에 추가
 * 2024.09.27    이승철      Modified    주석 해제
 */

import { Expert } from '@_modules/expert/entity/expert.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExpertPaginationQueryDto } from '@_modules/expert/dto/expert-pagination-query.dto';
import { ExpertListResponseDto, ExpertResponseDto } from '@_modules/expert/dto/expert-response.dto';

@Injectable()
export class ExpertService {
  constructor(
    @InjectRepository(Expert)
    private readonly expertRepository: Repository<Expert>,
  ) {}

  // 전문가 리스트 조회 (페이지네이션 적용)
  async getExperts(expertPaginationQueryDto: ExpertPaginationQueryDto): Promise<ExpertListResponseDto> {
    const { page, limit } = expertPaginationQueryDto;
    const actualPage = Math.max(page, 1);
    const totalCount = await this.expertRepository.count();
    const totalPages = Math.ceil(totalCount / limit);

    const finalPage = totalPages === 0 ? 1 : Math.min(actualPage, totalPages);

    const data = await this.expertRepository.find({
      skip: (finalPage - 1) * limit,
      take: limit,
    });

    return { data, totalCount };
  }

  // 전문가 상세 조회
  async getExpertById(id: number): Promise<ExpertResponseDto> {
    return this.expertRepository.findOne({ where: { id } });
  }
}
