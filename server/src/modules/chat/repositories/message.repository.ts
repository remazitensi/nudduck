/*
 * File Name    : message.repository.ts
 * Description  : Message 관련 데이터베이스 접근 로직을 처리하는 리포지토리
 * Author       : 김재영
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.17    김재영      Created     메시지 관련 데이터베이스 작업 처리
 * 2024.09.20    김재영      Modified    에러 처리 로직 추가 및 메시지 저장 기능 개선
 * 2024.09.21    김재영      Modified    1대1 채팅 기능에 맞춘 로직 수정
 * 2024.09.22    김재영      Modified    SaveMessageDto에 맞게 saveMessage 메서드 수정
 */

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { Message } from '../entities/message.entity';
import { SaveMessageDto } from '../interfaces/chat.interface';

@Injectable()
export class MessageRepository extends Repository<Message> {
  constructor(dataSource: DataSource) {
    super(Message, dataSource.createEntityManager());
  }

  /**
   * 특정 1:1 방에 속한 메시지들 찾기
   * @param roomId 방 ID
   * @returns 해당 방의 메시지 목록 (시간순 정렬)
   */
  async findMessagesByRoom(roomId: number): Promise<Message[]> {
    try {
      return await this.find({
        where: { chatroom: { chatroomId: roomId } },
        order: { timestamp: 'ASC' }, // 메시지를 시간순으로 정렬
      });
    } catch {
      throw new InternalServerErrorException('메시지를 불러오는 도중 오류가 발생했습니다.');
    }
  }

  /**
   * 1:1 채팅방에 메시지 저장
   * @param messageData 메시지 저장 데이터
   * @returns 저장된 메시지
   */
  async saveMessage(messageData: SaveMessageDto): Promise<Message> {
    const message = this.create({
      user: { id: messageData.userId }, // 유저 정보를 설정
      chatroom: { chatroomId: messageData.chatroomId }, // 채팅방 정보를 설정
      content: messageData.content,
      timestamp: new Date(),
    });

    try {
      return await this.save(message);
    } catch {
      throw new InternalServerErrorException('메시지를 저장하는 도중 오류가 발생했습니다.');
    }
  }
}
