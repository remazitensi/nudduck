/**
 * File Name    : pagination-query.dto.ts
 * Description  : 페이지네이션 요청 시 사용되는 DTO
 * Author       : 김재영
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.11    김재영      Created     페이지네이션 DTO 초기 생성
 */

import { IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @IsPositive()
  page: number = 1; // 기본값을 1

  @IsOptional()
  @IsPositive()
  @Min(1)
  pageSize: number = 10; // 기본값을 10
}
