/**
 * File Name    : expert.service.ts
 * Description  : expert 서비스 로직
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.14    이승철      Created
 */

import { Expert } from '@_expert/entity/expert.entity';
import { ExpertRepository } from '@_expert/expert.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ExpertService {
  constructor(private readonly expertRepository: ExpertRepository) {}

  // 전문가 리스트 조회 (페이지네이션 적용)
  async getExperts(page: number, limit: number): Promise<{ data: Expert[]; totalCount: number }> {
    // page가 1보다 작은 경우 1로 설정
    page = Math.max(page, 1);

    // 첫 번째로 전체 전문가 수를 가져옴
    const totalCount = await this.expertRepository.findTotalCount();
    const totalPages = Math.ceil(totalCount / limit);

    // 만약 page가 전체 페이지 수를 초과하면 마지막 페이지 데이터 반환
    if (page > totalPages) {
      page = totalPages;
    }

    // 전문가 리스트를 가져옴
    const data = await this.expertRepository.findExperts(page, limit);

    // data와 totalCount 함께 반환
    return { data, totalCount };
  }

  // 전문가 상세 조회
  async getExpertById(id: number): Promise<Expert> {
    return this.expertRepository.findExpertById(id);
  }
}
