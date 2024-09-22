/*
 * File Name    : room.entity.ts
 * Description  : 채팅방 정보를 저장하는 엔티티
 * Author       : 김재영
 *
 * History
 * Date          Author      Status      Description
 * 2024-09-17    김재영      Created     채팅방 엔티티 정의
 * 2024.09.20    김재영      modified    채팅방 엔티티 수정 (참가자 추가)
 */

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Message } from './message.entity';
import { User } from '@_modules/user/entity/user.entity';

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
    description: '채팅방 참여자 ID 목록 (JSON 배열)',
    example: [101, 102],
  })
  @Column('json')
  participants: number[];

  @ApiProperty({
    description: '채팅방 생성자',
    example: 101,
  })
  @ManyToOne(() => User, (user) => user.chatRooms, { eager: false }) // 양방향 설정
  @JoinColumn({ name: 'createdBy' })
  createdBy: User;

  @ApiProperty({
    description: '채팅방이 생성된 시간',
    example: '2024-09-17T10:00:00Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: '채팅방 내의 메시지 목록',
    type: [Message],
  })
  @OneToMany(() => Message, (message) => message.chatroom)
  messages: Message[];
}
