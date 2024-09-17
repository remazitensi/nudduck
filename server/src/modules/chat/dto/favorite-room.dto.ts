/*
 * File Name    : favorite-room.dto.ts
 * Description  : 즐겨찾기 추가 시 요청 데이터 정의
 * Author       : 김재영
 *
 * History
 * Date          Author      Status      Description
 * 2024-09-17    김재영      Created     즐겨찾기 추가 DTO 정의
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class FavoriteRoomDto {
  @ApiProperty({
    description: '즐겨찾기 추가할 사용자 ID',
    example: 101,
  })
  @IsNotEmpty()
  readonly userId: number;

  @ApiProperty({
    description: '즐겨찾기할 채팅방 ID',
    example: 1,
  })
  @IsNotEmpty()
  readonly chatroomId: number;
}
