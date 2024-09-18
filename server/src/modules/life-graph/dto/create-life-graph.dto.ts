/**
 * File Name    : create-life-graph.dto.ts
 * Description  : 인생그래프 생성 dto
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.17    이승철      Created
 * 2024.09.18    이승철      Modified    이벤트 제목 추가
 */

import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { EventDto } from './event.dto';

export class CreateLifeGraphDto {
  @ApiProperty({ example: 25, description: '현재 나이' })
  @IsNumber()
  @IsNotEmpty()
  currentAge: number;

  @ApiProperty({ example: 'My Life Graph', description: '그래프 제목' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: [
      { age: 10, score: 4, title: 'Started school', description: 'Started elementary school' },
      { age: 20, score: 3, title: 'Graduated college', description: 'Graduated with a bachelor\'s degree' },
    ],
    description: '이벤트 목록',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EventDto)
  events: EventDto[];
}
