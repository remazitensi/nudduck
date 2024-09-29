/*
 * File Name    : english-sentence.dto.ts
 * Description  : 영문장 DTO
 * Author       : 김재영
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.23    김재영      Created     영문장 dto 생성
 */

import { ApiProperty } from '@nestjs/swagger';

export class EnglishSentenceDto {
  @ApiProperty({ example: 1, description: '영문장의 고유 ID' })
  id: number;

  @ApiProperty({ example: 'The only limit to our realization of tomorrow is our doubts of today.', description: '영어 문장' })
  english: string;

  @ApiProperty({ example: '내일을 실현하는 유일한 한계는 오늘의 의심이다.', description: '해석된 한국어 문장' })
  korean: string;

  @ApiProperty({
    example: '이 문장은 1형식으로 주어 + 동사 구조입니다.',
    description: '추가적인 설명',
    required: false,
  })
  note?: string;
}
