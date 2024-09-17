/*
 * File Name    : room.repository.ts
 * Description  : Room 관련 데이터베이스 접근 로직을 처리하는 리포지토리
 * Author       : 김재영
 *
 * History
 * Date          Author      Status      Description
 * 2024-09-17    김재영      Created     채팅방 관련 데이터베이스 작업 처리
 */

import { Repository } from 'typeorm';
import { ChatRoom } from '../entities/chat-room.entity';
import { CreateRoomDto } from '../interfaces/chat.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RoomRepository extends Repository<ChatRoom> {
  /**
   * 채팅방 생성
   * @param createRoomDto 채팅방 생성 요청 데이터
   * @returns 생성된 채팅방 객체
   */
  async createRoom(createRoomDto: CreateRoomDto): Promise<ChatRoom> {
    const { chatroomName, userId } = createRoomDto;
    const chatRoom = this.create({
      chatroomName,
      userId,
      createdAt: new Date(),
    });
    return await this.save(chatRoom);
  }

  /**
   * 채팅방 삭제
   * @param chatroomId 삭제할 채팅방 ID
   * @returns 삭제된 채팅방 객체
   */
  async deleteRoom(chatroomId: number): Promise<void> {
    await this.delete(chatroomId);
  }

  /**
   * 채팅방 조회
   * @param chatroomId 조회할 채팅방 ID
   * @returns 조회된 채팅방 객체
   */
  async findRoomById(chatroomId: number): Promise<ChatRoom | undefined> {
    return await this.findOne({ where: { chatroomId } });
  }

  // 기타 메서드 추가 가능
}
