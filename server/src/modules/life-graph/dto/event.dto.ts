/**
 * File Name    : event.dto.ts
 * Description  : 인생그래프 이벤트 dto
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.17    이승철      Created
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class EventDto {
  @ApiPropertyOptional({ description: '이벤트 ID (수정 시 필요)' })
  @IsNumber()
  @IsOptional()
  id?: number;

  @ApiProperty({ example: 10, description: '나이' })
  @IsNumber()
  @IsNotEmpty()
  age: number;

  @ApiProperty({ example: 3, description: '점수', minimum: -5, maximum: 5 })
  @IsNumber()
  @Min(-5)
  @Max(5)
  score: number;

  @ApiProperty({ example: 'Started school', description: '설명' })
  @IsString()
  @IsNotEmpty()
  description: string;
}
