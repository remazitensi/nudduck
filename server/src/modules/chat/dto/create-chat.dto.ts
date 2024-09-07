import { ApiProperty } from '@nestjs/swagger';

export class CreateChatDto {
  @ApiProperty({ description: '상대방 사용자 ID', example: 'user123' })
  otherUserId: string;
}
