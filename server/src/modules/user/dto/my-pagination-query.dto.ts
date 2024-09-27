/**
 * File Name    : my-pagination-query.dto.ts
 * Description  : 나의 게시글 페이지네이션 쿼리 dto
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.23    이승철      Created
 */

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class MyPaginationQueryDto {
  @ApiPropertyOptional({ description: '페이지 번호', example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({ description: '페이지 당 게시글 수', example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number = 10;
}
