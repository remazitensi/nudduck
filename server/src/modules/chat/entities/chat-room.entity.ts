/*
 * File Name    : chat-room.entity.ts
 * Description  : 채팅방 정보를 저장하는 엔티티
 * Author       : 김재영
 *
 * History
 * Date          Author      Status      Description
 * 2024-09-17    김재영      Created     채팅방 엔티티 정의
 */

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('ChatRoom')
export class ChatRoom {
  @ApiProperty({
    description: '채팅방의 고유 ID',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  chatroomId: number;

  @ApiProperty({
    description: '채팅방 이름',
    example: '1대1 채팅방',
  })
  @Column({ length: 255 })
  chatroomName: string;

  @ApiProperty({
    description: '채팅방을 생성한 사용자 ID',
    example: 101,
  })
  @Column()
  userId: number;

  @ApiProperty({
    description: '채팅방이 생성된 시간',
    example: '2024-09-17T10:00:00Z',
  })
  @CreateDateColumn()
  createdAt: Date;
}
