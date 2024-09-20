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
 */

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { ChatRoom } from '../entities/chat-room.entity';

@Injectable()
export class RoomRepository extends Repository<ChatRoom> {
  constructor(private dataSource: DataSource) {
    super(ChatRoom, dataSource.createEntityManager());
  }

  // 두 사용자로 1:1 채팅방 찾기
  async findByUsers(userId: number, recipientId: number): Promise<ChatRoom | undefined> {
    try {
      return await this.createQueryBuilder('room')
        .innerJoin('room.users', 'user')
        .where('user.id = :userId', { userId })
        .orWhere('user.id = :recipientId', { recipientId })
        .groupBy('room.id')
        .having('COUNT(DISTINCT user.id) = 2')
        .getOne();
    } catch (error) {
      throw new InternalServerErrorException(`채팅방을 찾는 도중 오류가 발생했습니다: ${error.message}`);
    }
  }

  // 1대1 채팅방 생성
  async createRoom(room: ChatRoom): Promise<ChatRoom> {
    try {
      return await this.save(room);
    } catch (error) {
      throw new InternalServerErrorException(`채팅방을 생성하는 도중 오류가 발생했습니다: ${error.message}`);
    }
  }

  // 모든 채팅방 목록 조회
  async findAllRooms(): Promise<ChatRoom[]> {
    try {
      return await this.find(); // 모든 채팅방을 조회
    } catch (error) {
      throw new InternalServerErrorException(`채팅방 목록을 조회하는 도중 오류가 발생했습니다: ${error.message}`);
    }
  }
}
