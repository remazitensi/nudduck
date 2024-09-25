/**
 * File Name    : pagination-query.dto.ts
 * Description  : 페이지네이션 요청 시 사용되는 DTO
 * Author       : 김재영
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.11    김재영      Created     페이지네이션 DTO 초기 생성
 * 2024.09.12    김재영      Modified    Swagger 데코레이터 및 기본값 추가
 * 2024.09.23    김재영      Modified    limit, offset 추가하여 무한 스크롤 지원
 */

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationQueryDto {
  @ApiPropertyOptional({
    description: '조회할 페이지 번호 (기본값: 1)',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  page: number = 1; // 기본값 1로 설정

  @ApiPropertyOptional({
    description: '페이지당 항목 수 (기본값: 10)',
    example: 10,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  pageSize: number = 10; // 기본값 10으로 설정

  @ApiPropertyOptional({
    description: '정렬 기준 (예: createdAt:desc)',
    example: 'createdAt:desc',
    required: false,
  })
  sort?: string;

  @ApiPropertyOptional({
    description: '조회할 항목 수 (limit, 기본값: 10)',
    example: 10,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  limit: number = 10; // 기본값 10으로 설정

  @ApiPropertyOptional({
    description: '조회 시작 지점 (offset, 기본값: 0)',
    example: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  offset: number = 0; // 기본값 0으로 설정
}
