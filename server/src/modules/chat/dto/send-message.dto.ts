import { ApiProperty } from '@nestjs/swagger';

export class SendMessageDto {
  @ApiProperty({ description: '메시지 내용', example: '안녕하세요!' })
  message: string;
}
