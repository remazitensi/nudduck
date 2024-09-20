/*
 * File Name    : favorite-chat-room.entity.ts
 * Description  : 사용자의 즐겨찾기 채팅방 정보를 저장하는 엔티티
 * Author       : 김재영
 *
 * History
 * Date          Author      Status      Description
 * 2024-09-17    김재영      Created     즐겨찾기 채팅방 엔티티 정의
 */

import { Entity, ManyToOne, PrimaryColumn, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';
import { ChatRoom } from './chat-room.entity';

@Entity('FavoriteChatRoom')
export class FavoriteChatRoom {
  @ApiProperty({
    description: '즐겨찾기 추가한 사용자',
    example: 101,
  })
  @PrimaryColumn()
  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ApiProperty({
    description: '즐겨찾기된 채팅방',
    example: 1,
  })
  @PrimaryColumn()
  @ManyToOne(() => ChatRoom, { eager: true })
  @JoinColumn({ name: 'chatroomId' })
  chatroom: ChatRoom;
}
