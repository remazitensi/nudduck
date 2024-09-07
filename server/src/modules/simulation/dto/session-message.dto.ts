// src/dto/simulation/session-message.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class SessionMessageDto {
  @ApiProperty({
    example: 'What is your strength?',
    description: '사용자 메시지',
  })
  message: string;
}
