/*
 * File Name    : message.entity.ts
 * Description  : 채팅방의 메시지를 저장하는 엔티티
 * Author       : 김재영
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.17    김재영      Created     메시지 엔티티 정의
 * 2024.09.20    김재영      Modified    메시지 엔티티 수정
 */

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { ChatRoom } from './chat-room.entity';
import { User } from './user.entity';

@Entity('ChatMessage')
export class Message {
  @ApiProperty({
    description: '메시지의 고유 ID',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  messageId: number;

  @ApiProperty({
    description: '메시지를 전송한 사용자',
    example: 101,
  })
  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ApiProperty({
    description: '메시지가 전송된 채팅방',
    example: 1,
  })
  @ManyToOne(() => ChatRoom, (chatRoom) => chatRoom.messages, { eager: true })
  @JoinColumn({ name: 'chatroomId' })
  chatroom: ChatRoom;

  @ApiProperty({
    description: '메시지 내용',
    example: '안녕하세요!',
  })
  @Column('text')
  content: string;

  @ApiProperty({
    description: '메시지가 전송된 시간',
    example: '2024-09-17T12:34:56Z',
  })
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;

  @ApiProperty({
    description: '메시지 읽음 여부',
    example: false,
  })
  @Column({ default: false })
  read: boolean;
}
