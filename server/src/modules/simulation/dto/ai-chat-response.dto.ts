/**
 * File Name    : ai-chat-response.dto.ts
 * Description  : ai-chat-response dto 설정
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.12    이승철      Created
 */

import { ApiProperty } from '@nestjs/swagger';

export class AIChatResponseDto {
  @ApiProperty({
    description: '유저가 AI에게 던진 질문',
    example: 'What is your strength?',
  })
  query: string;

  @ApiProperty({
    description: 'AI의 응답',
    example: 'My strength is ...',
  })
  answer: string;
}
