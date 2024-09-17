/*
 * File Name    : message.repository.ts
 * Description  : Message 관련 데이터베이스 접근 로직을 처리하는 리포지토리
 * Author       : 김재영
 *
 * History
 * Date          Author      Status      Description
 * 2024-09-17    김재영      Created     메시지 관련 데이터베이스 작업 처리
 */

import { Repository } from 'typeorm';
import { Message } from '../entities/message.entity';
import { SaveMessageDto } from '../interfaces/chat.interface';
import { Injectable } from '@nestjs/common';
import { ChatRoom } from '../entities/chat-room.entity';

@Injectable()
export class MessageRepository extends Repository<Message> {
  /**
   * 메시지 저장
   * @param saveMessageDto 메시지 저장 요청 데이터
   * @returns 저장된 메시지 객체
   */
  async saveMessage(saveMessageDto: SaveMessageDto): Promise<Message> {
    const { userId, chatroomId, content } = saveMessageDto;

    // 채팅방 엔티티 인스턴스를 생성하여 관계를 설정합니다.
    const chatRoom = new ChatRoom();
    chatRoom.chatroomId = chatroomId;

    // 메시지 엔티티를 생성합니다.
    const chatMessage = this.create({
      UserId: userId, // 사용자 ID
      chatroom: chatRoom, // 채팅방 엔티티 설정
      content, // 메시지 내용
      createdAt: new Date(), // 메시지 생성 시간
    });

    // 메시지 엔티티를 저장합니다.
    return await this.save(chatMessage);
  }

  /**
   * 채팅방 내 모든 메시지 조회
   * @param chatroomId 조회할 채팅방 ID
   * @returns 채팅방의 모든 메시지 객체 배열
   */
  async findMessagesByRoomId(chatroomId: number): Promise<Message[]> {
    return await this.find({
      where: {
        chatroom: {
          chatroomId, // 채팅방 ID로 메시지 조회
        },
      },
      relations: ['chatroom'], // 채팅방 관계를 로드
    });
  }

  // TODO: 추후 유저 연동 기능 추가 필요
  // - 메시지 전송 시 사용자 정보와 연동
  // - 메시지 조회 시 사용자 정보 포함
}
