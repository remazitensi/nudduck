/**
 * File Name    : update-life-graph.dto.ts
 * Description  : 인생그래프 수정 dto
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.17    이승철      Created
 * 2024.09.18    이승철      Modified    이벤트 제목 추가
 * 2024.09.18    이승철      Modified    삭제 이벤트 id 제거
 */

import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { EventDto } from '@_modules/life-graph/dto/event.dto';

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
      { age: 10, score: 4, title: 'Started school', description: 'Started elementary school' },
      { age: 20, score: 3, title: 'Graduated college', description: 'Graduated with a bachelor\'s degree' },
    ],
    description: '이벤트 목록',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EventDto)
  @IsOptional()
  events?: EventDto[];
}
