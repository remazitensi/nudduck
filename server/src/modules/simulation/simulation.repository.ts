/**
 * File Name    : simulation.repository.ts
 * Description  : simulation repository
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.12    이승철      Created
 */

import { AIChatMessage, AIChatSession } from '@_simulation/entity/ai-chat.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SimulationRepository {
  constructor(
    @InjectRepository(AIChatSession)
    private readonly sessionRepository: Repository<AIChatSession>,

    @InjectRepository(AIChatMessage)
    private readonly messageRepository: Repository<AIChatMessage>,
  ) {}

  // 특정 유저의 모든 세션 조회
  async getUserSessions(userId: number): Promise<AIChatSession[]> {
    return this.sessionRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  // 특정 세션의 메시지 조회
  async getMessagesBySessionId(sessionId: number): Promise<AIChatMessage[]> {
    return this.messageRepository.find({
      where: { sessionId },
      order: { createdAt: 'ASC' },
    });
  }

  // 채팅 세션 생성 (처음엔 주제 없이 생성)
  async createSession(userId: number): Promise<AIChatSession> {
    const session = this.sessionRepository.create({ userId, topic: null });
    return this.sessionRepository.save(session);
  }

  // 메시지 개수 조회 (세션 내 메시지 수 파악)
  async countMessagesBySessionId(sessionId: number): Promise<number> {
    return this.messageRepository.count({ where: { sessionId } });
  }

  // 세션의 주제 업데이트 (유저의 첫 메시지를 주제로 설정)
  async updateSessionTopic(sessionId: number, topic: string): Promise<void> {
    await this.sessionRepository.update({ id: sessionId }, { topic });
  }

  // 특정 세션에 메시지 저장
  async saveMessage(sessionId: number, message: string, sender: 'user' | 'ai'): Promise<AIChatMessage> {
    const chatMessage = this.messageRepository.create({ sessionId, message, sender });
    return this.messageRepository.save(chatMessage);
  }
}
