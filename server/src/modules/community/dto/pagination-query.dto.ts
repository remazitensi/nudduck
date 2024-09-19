/**
 * File Name    : pagination-query.dto.ts
 * Description  : 페이지네이션 요청 시 사용되는 DTO
 * Author       : 김재영
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.11    김재영      Created     페이지네이션 DTO 초기 생성
 * 2024.09.12    김재영      Modified    Swagger 데코레이터 및 기본값 추가
 */

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationQueryDto {
  @ApiPropertyOptional({
    description: '조회할 페이지 번호 (기본값: 1)',
    example: 1,
  })
  @IsOptional()
  @IsPositive()
  page: number = 1; // 기본값을 1

  @ApiPropertyOptional({
    description: '페이지당 항목 수 (기본값: 10)',
    example: 10,
  })
  @IsOptional()
  @IsPositive()
  @Min(1)
  pageSize: number = 10; // 기본값을 10
}
