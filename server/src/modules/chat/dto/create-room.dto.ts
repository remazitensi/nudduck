/*
 * File Name    : create-room.dto.ts
 * Description  : 채팅방 생성 시 요청 데이터 정의
 * Author       : 김재영
 *
 * History
 * Date          Author      Status      Description
 * 2024-09-17    김재영      Created     채팅방 생성 DTO 정의
 * 2024-09-20    김재영      Modified    참가자 목록 추가 및 userId 제거
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
    description: '채팅방 참가자 ID 목록 (최소 2명 이상)',
    example: [101, 102],
  })
  @IsArray()
  @IsNumber({}, { each: true })
  @IsNotEmpty({ message: '참가자 목록이 비어있으면 안 됩니다.' })
  readonly participants: number[]; // userId는 participants에 포함
}
