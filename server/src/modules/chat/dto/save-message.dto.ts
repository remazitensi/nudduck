/*
 * File Name    : save-message.dto.ts
 * Description  : 메시지 저장 시 요청 데이터 정의
 * Author       : 김재영
 *
 * History
 * Date          Author      Status      Description
 * 2024-09-17    김재영      Created     메시지 저장 DTO 정의
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class SaveMessageDto {
  @ApiProperty({
    description: '메시지를 전송한 사용자 ID',
    example: 101,
  })
  @IsNotEmpty()
  readonly senderId: number;

  @ApiProperty({
    description: '메시지가 전송될 채팅방 ID',
    example: 1,
  })
  @IsNotEmpty()
  readonly chatroomId: number;

  @ApiProperty({
    description: '메시지 내용',
    example: '안녕하세요!',
  })
  @IsString()
  @IsNotEmpty()
  readonly content: string;
}
