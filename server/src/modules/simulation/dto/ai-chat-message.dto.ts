/**
 * File Name    : ai-chat-message.dto.ts
 * Description  : ai-chat-message dto 설정
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.12    이승철      Created
 * 2024.09.16    이승철      Modified    절대경로 변경, 예시 추가
 */

import { AIChatMessage } from '@_modules/simulation/entity/ai-chat.entity';
import { ApiProperty } from '@nestjs/swagger';

export class AIChatMessageDto {
  @ApiProperty({
    description: '특정 세션의 대화 메시지 기록',
    type: [AIChatMessage],
    example: [
      {
        id: 1,
        sessionId: 1,
        message: '어떤 면접질문을 드릴까요?',
        sender: 'ai',
        createdAt: '2024-09-10T14:24:00.000Z',
      },
      {
        id: 2,
        sessionId: 1,
        message: '랜덤',
        sender: 'user',
        createdAt: '2024-09-10T14:24:30.000Z',
      },
    ],
  })
  messages: AIChatMessage[];
}
