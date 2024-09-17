/**
 * File Name    : update-life-graph.dto.ts
 * Description  : 인생그래프 수정 dto
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.17    이승철      Created
 */

import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { EventDto } from './event.dto';

export class UpdateLifeGraphDto {
  @ApiPropertyOptional({ example: 26, description: '현재 나이' })
  @IsNumber()
  @IsOptional()
  currentAge?: number;

  @ApiPropertyOptional({ example: 'Updated Life Graph', description: '그래프 제목' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    example: [
      { age: 10, score: 7, description: 'Started school' },
      { age: 30, score: 9, description: 'Got a new job' },
    ],
    description: '이벤트 목록',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EventDto)
  @IsOptional()
  events?: EventDto[];

  // 삭제된 이벤트의 ID 목록을 관리하기 위한 필드 추가
  @ApiPropertyOptional({
    example: [1, 2, 3],
    description: '삭제된 이벤트 ID 목록',
  })
  @IsArray()
  @IsOptional()
  deletedEventIds?: number[]; // 삭제할 이벤트의 ID
}
