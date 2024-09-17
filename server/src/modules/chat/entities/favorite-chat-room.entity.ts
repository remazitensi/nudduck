/*
 * File Name    : favorite-chat-room.entity.ts
 * Description  : 사용자의 즐겨찾기 채팅방 정보를 저장하는 엔티티
 * Author       : 김재영
 *
 * History
 * Date          Author      Status      Description
 * 2024-09-17    김재영      Created     즐겨찾기 채팅방 엔티티 정의
 */

import { Entity, PrimaryColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('FavoriteChatRoom')
export class FavoriteChatRoom {
  @ApiProperty({
    description: '즐겨찾기 추가한 사용자 ID',
    example: 101,
  })
  @PrimaryColumn()
  userId: number;

  @ApiProperty({
    description: '즐겨찾기된 채팅방 ID',
    example: 1,
  })
  @PrimaryColumn()
  chatroomId: number;
}
