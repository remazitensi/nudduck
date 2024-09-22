/*
 * File Name    : create-room.dto.ts
 * Description  : 채팅방 생성 시 요청 데이터 정의
 * Author       : 김재영
 *
 * History
 * Date          Author      Status      Description
 * 2024-09-17    김재영      Created     채팅방 생성 DTO 정의
 * 2024-09-20    김재영      Modified    참가자 목록 추가
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsArray, IsNumber } from 'class-validator';

export class CreateRoomDto {
  @ApiProperty({
    description: '채팅방 이름',
    example: '1대1 채팅방',
  })
  @IsString()
  @IsNotEmpty()
  readonly chatroomName: string;

  @ApiProperty({
    description: '채팅방을 생성한 사용자 ID',
    example: 101,
  })
  @IsNotEmpty()
  readonly userId: number;

  @ApiProperty({
    description: '채팅방 참가자 ID 목록',
    example: [101, 102],
  })
  @IsArray()
  @IsNumber({}, { each: true })
  readonly participants: number[];
}
