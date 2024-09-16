/**
 * File Name    : ai-chat-history.dto.ts
 * Description  : ai-chat-history dto 설정
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.12    이승철      Created
 * 2024.09.16    이승철      Modified    절대경로 변경, 예시 추가
 */

import { AIChatSession } from '@_modules/simulation/entity/ai-chat.entity';
import { ApiProperty } from '@nestjs/swagger';

export class AIChatHistoryDto {
  @ApiProperty({
    description: '유저의 채팅 세션 기록',
    type: [AIChatSession],
    example: [
      {
        id: 1,
        userId: 123,
        topic: '랜덤',
        createdAt: '2024-09-10T14:23:34.000Z',
      },
      {
        id: 2,
        userId: 123,
        topic: '아무 면접질문',
        createdAt: '2024-09-09T10:45:12.000Z',
      },
    ],
  })
  history: AIChatSession[];
}
