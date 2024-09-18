/**
 * File Name    : life-graph-page.dto.ts
 * Description  : 인생그래프 페이지네이션 dto
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.17    이승철      Created
 */

import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class LifeGraphPageDto {
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
}
