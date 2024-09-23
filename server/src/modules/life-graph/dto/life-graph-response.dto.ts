/**
 * File Name    : life-graph-response.dto.ts
 * Description  : life-graph-response dto 설정
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.21    이승철      Created
 * 2024.09.24    이승철      Modified    카멜케이스로 변경
 */

import { ApiProperty } from '@nestjs/swagger';

export class LifeGraphEventDto {
  @ApiProperty({ example: 10, description: '이벤트 발생 나이' })
  age: number;

  @ApiProperty({ example: 4, description: '이벤트 점수' })
  score: number;

  @ApiProperty({ example: 'Started school', description: '이벤트 제목' })
  title: string;

  @ApiProperty({ example: 'Started elementary school', description: '이벤트 설명' })
  description: string;
}

export class LifeGraphResponseDto {
  @ApiProperty({ example: 1, description: '인생 그래프 ID' })
  id: number;

  @ApiProperty({ example: 25, description: '현재 나이' })
  currentAge: number;

  @ApiProperty({ example: 'My Life Graph', description: '그래프 제목' })
  title: string;

  @ApiProperty({ type: [LifeGraphEventDto], description: '이벤트 목록' })
  events: LifeGraphEventDto[];

  @ApiProperty({ example: '2024-09-17T00:00:00.000Z', description: '생성 날짜' })
  createdAt: Date;

  @ApiProperty({ example: '2024-09-17T00:00:00.000Z', description: '수정 날짜' })
  updatedAt: Date;
}

export class LifeGraphListResponseDto {
  @ApiProperty({ type: [LifeGraphResponseDto], description: '인생 그래프 목록' })
  data: LifeGraphResponseDto[];

  @ApiProperty({ example: 10, description: '총 인생 그래프 수' })
  totalCount: number;
}
