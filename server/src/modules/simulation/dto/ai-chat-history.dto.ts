/**
 * File Name    : ai-chat-history.dto.ts
 * Description  : ai-chat-history dto 설정
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.12    이승철      Created
 */

import { AIChatSession } from '@_simulation/entity/ai-chat.entity';
import { ApiProperty } from '@nestjs/swagger';

export class AIChatHistoryDto {
  @ApiProperty({
    description: '유저의 채팅 세션 기록',
    type: [AIChatSession],
  })
  history: AIChatSession[];
}
