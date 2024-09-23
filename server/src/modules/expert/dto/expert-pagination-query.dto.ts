/**
 * File Name    : expert-pagination-query.dto.ts
 * Description  : 전문가 페이지네이션 쿼리 dto
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.14    이승철      Created
 * 2024.09.24    이승철      Modified    limit 추가
 * 2024.09.24    이승철      Modified    limit 기본값 변경
 */

import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class ExpertPaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiPropertyOptional({
    description: '페이지 번호 (기본값: 1)',
    example: 1,
    minimum: 1,
  })
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiPropertyOptional({
    description: '페이지 당 항목 수 (기본값: 1)',
    example: 1,
    minimum: 1,
  })
  limit: number = 1;
}
