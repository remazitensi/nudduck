/**
 * File Name    : ask-ai.dto.ts
 * Description  : ask-ai dto 설정
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.12    이승철      Created
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class AskAIDto {
  @ApiProperty({
    example: 'What is your strength?',
    description: '사용자가 AI에게 던지는 질문',
  })
  @IsString()
  query: string;

  @ApiProperty({
    example: 1,
    description: '채팅 세션 ID',
  })
  @IsNumber()
  sessionId: number;
}
