/**
 * File Name    : ai-chat-message.dto.ts
 * Description  : ai-chat-message dto 설정
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.12    이승철      Created
 */

import { AIChatMessage } from '@_simulation/entity/ai-chat.entity';
import { ApiProperty } from '@nestjs/swagger';

export class AIChatMessageDto {
  @ApiProperty({
    description: '특정 세션의 대화 메시지 기록',
    type: [AIChatMessage],
  })
  messages: AIChatMessage[];
}
