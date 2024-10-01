/**
 * File Name    : create-event.dto.ts
 * Description  : 인생그래프 생성 이벤트 dto
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.17    이승철      Created
 * 2024.09.18    이승철      Modified    이벤트 제목 추가
 * 2024.09.29    이승철      Modified    id 삭제
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class EventDto {
  @ApiProperty({ example: 10, description: '나이' })
  @IsNumber()
  @IsNotEmpty()
  age: number;

  @ApiProperty({ example: 3, description: '점수', minimum: -5, maximum: 5 })
  @IsNumber()
  @IsNotEmpty()
  @Min(-5)
  @Max(5)
  score: number;

  @ApiProperty({ example: 'Started school', description: '이벤트 제목' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Started school', description: '설명' })
  @IsString()
  @IsNotEmpty()
  description: string;
}

