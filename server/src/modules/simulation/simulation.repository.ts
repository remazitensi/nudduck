/**
 * File Name    : simulation.repository.ts
 * Description  : simulation repository
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.12    이승철      Created
 * 2024.09.16    이승철      Modified    쿼리하는 Row 개수 제한
 */

import { AIChatMessage, AIChatSession } from '@_modules/simulation/entity/ai-chat.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';

@Injectable()
export class SimulationRepository {
  constructor(
    @InjectRepository(AIChatSession)
    private readonly sessionRepository: Repository<AIChatSession>,

    @InjectRepository(AIChatMessage)
    private readonly messageRepository: Repository<AIChatMessage>,
  ) {}

  // 특정 유저의 최근 7일 이내의 세션 조회
  async findUserSessions(userId: number): Promise<AIChatSession[]> {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    return this.sessionRepository.find({
      where: { userId, createdAt: MoreThan(threeDaysAgo) },
      order: { createdAt: 'DESC' },
    });
  }

  // 특정 세션에서 최근 대화 20개를 가져와서 다시 최신순으로 정렬
  async findMessagesBySessionId(sessionId: number): Promise<AIChatMessage[]> {
    const messages = await this.messageRepository.find({
      where: { sessionId },
      order: { createdAt: 'DESC' }, // 최신 대화부터 20개 가져옴
      take: 20,
    });

    // 가져온 메시지를 다시 오래된 순으로 정렬
    return messages.reverse();
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
  async createMessage(sessionId: number, message: string, sender: 'user' | 'ai'): Promise<AIChatMessage> {
    const chatMessage = this.messageRepository.create({ sessionId, message, sender });
    return this.messageRepository.save(chatMessage);
  }
}
