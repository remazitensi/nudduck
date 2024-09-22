/*
 * File Name    : room.repository.ts
 * Description  : Room 관련 데이터베이스 접근 로직을 처리하는 리포지토리
 * Author       : 김재영
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.17    김재영      Created     채팅방 관련 데이터베이스 작업 처리
 * 2024.09.20    김재영      Modified    메시지 레포지토리와 통합된 에러 처리 로직 추가
 * 2024.09.21    김재영      Modified    채팅방 목록 조회 기능 추가
 * 2024.09.22    김재영      Modified    CreateRoomDto에 맞게 createRoom 메서드 수정
 */

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { ChatRoom } from '../entities/room.entity';
import { CreateRoomDto } from '../interfaces/chat.interface';

@Injectable()
export class RoomRepository extends Repository<ChatRoom> {
  constructor(private dataSource: DataSource) {
    super(ChatRoom, dataSource.createEntityManager());
  }

  /**
   * 두 사용자로 1:1 채팅방 찾기
   * @param userId 사용자 ID
   * @param recipientId 상대방 ID
   * @returns 채팅방
   */
  async findByUsers(userId: number, recipientId: number): Promise<ChatRoom | undefined> {
    try {
      return await this.createQueryBuilder('room')
        .innerJoin('room.participants', 'user')
        .where('user.id IN (:...userIds)', { userIds: [userId, recipientId] })
        .groupBy('room.chatroomId')
        .having('COUNT(DISTINCT user.id) = 2')
        .getOne();
    } catch {
      throw new InternalServerErrorException('채팅방을 찾는 도중 오류가 발생했습니다.');
    }
  }

  /**
   * 1대1 채팅방 생성
   * @param roomData 채팅방 데이터
   * @returns 생성된 채팅방
   */
  async createRoom(roomData: CreateRoomDto): Promise<ChatRoom> {
    const room = this.create({
      chatroomName: roomData.chatroomName,
      participants: roomData.participants, // 참가자 목록을 직접 사용
    });

    try {
      return await this.save(room);
    } catch {
      throw new InternalServerErrorException('채팅방을 생성하는 도중 오류가 발생했습니다.');
    }
  }

  /**
   * 채팅방 ID로 채팅방 조회
   * @param roomId 채팅방 ID
   * @returns 채팅방
   */
  async findRoomById(roomId: number): Promise<ChatRoom | undefined> {
    try {
      return await this.findOne({ where: { chatroomId: roomId } });
    } catch {
      throw new InternalServerErrorException('채팅방을 조회하는 도중 오류가 발생했습니다.');
    }
  }

  /**
   * 모든 채팅방 목록 조회
   * @returns 채팅방 목록
   */
  async findAllRooms(): Promise<ChatRoom[]> {
    try {
      return await this.find();
    } catch {
      throw new InternalServerErrorException('채팅방 목록을 조회하는 도중 오류가 발생했습니다.');
    }
  }
}
