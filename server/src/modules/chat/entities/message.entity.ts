/*
 * File Name    : message.entity.ts
 * Description  : 채팅방의 메시지를 저장하는 엔티티
 * Author       : 김재영
 *
 * History
 * Date          Author      Status      Description
 * 2024-09-17    김재영      Created     메시지 엔티티 정의
 */

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { ChatRoom } from './chat-room.entity';

@Entity('ChatMessage')
export class Message {
  @ApiProperty({
    description: '메시지의 고유 ID',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  messageId: number;

  @ApiProperty({
    description: '메시지를 전송한 사용자 ID',
    example: 101,
  })
  @Column()
  UserId: number;

  @ApiProperty({
    description: '메시지가 전송된 채팅방 ID',
    example: 1,
  })
  @ManyToOne(() => ChatRoom, { eager: true })
  chatroom: ChatRoom;

  @ApiProperty({
    description: '메시지 내용',
    example: '안녕하세요!',
  })
  @Column('text')
  content: string;

  @ApiProperty({
    description: '메시지가 생성된 시간',
    example: '2024-09-17T10:00:00Z',
  })
  @CreateDateColumn()
  createdAt: Date;
}
