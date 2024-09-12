/**
 * File Name    : simulation.service.ts
 * Description  : simulation 서비스 로직
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.12    이승철      Created
 */

import { AIChatMessage, AIChatSession } from '@_simulation/entity/ai-chat.entity';
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { SimulationRepository } from './simulation.repository';

@Injectable()
export class SimulationService {
  constructor(private readonly simulationRepository: SimulationRepository) {}

  // 특정 유저의 채팅 세션 조회
  async getUserSessions(userId: number): Promise<AIChatSession[]> {
    return this.simulationRepository.getUserSessions(userId);
  }

  // 특정 세션의 대화 기록 조회
  async getSessionHistory(sessionId: number): Promise<AIChatMessage[]> {
    return this.simulationRepository.getMessagesBySessionId(sessionId);
  }

  // 세션이 없을 경우 새로 시작하도록 로직 추가
  async handleSession(userId: number, startNewChat: boolean): Promise<AIChatSession> {
    if (startNewChat) {
      // 새로운 세션 시작
      const newSession = await this.createSession(userId);
      await this.saveAIMessage(newSession.id, '어떤 도움이 필요하시나요?');
      return newSession;
    } else {
      // 이전 세션 이어받기
      const lastSession = await this.getLastSession(userId);
      if (lastSession) {
        return lastSession;
      } else {
        // 세션이 없을 경우 새로 시작
        const newSession = await this.createSession(userId);
        await this.saveAIMessage(newSession.id, '어떤 도움이 필요하시나요?');
        return newSession;
      }
    }
  }

  // 채팅 세션 생성
  private async createSession(userId: number): Promise<AIChatSession> {
    return this.simulationRepository.createSession(userId);
  }

  // 최근 채팅 세션 조회 (이전 대화를 이어받을 때 사용)
  private async getLastSession(userId: number): Promise<AIChatSession | null> {
    const sessions = await this.simulationRepository.getUserSessions(userId);

    if (sessions.length > 0) {
      return sessions[0]; // 가장 최근 세션 반환
    }
    return null;
  }

  // AI 서버로 질문을 보내고 응답 받기
  async getAIResponse(query: string): Promise<{ Answer: string }> {
    const response = await axios.post('http://localhost:5000/query', { query });
    return response.data;
  }

  // 유저의 첫 번째 메시지를 주제로 설정하고 메시지 저장
  async saveUserMessage(sessionId: number, message: string): Promise<void> {
    const messageCount = await this.simulationRepository.countMessagesBySessionId(sessionId);
    const firstAIMessage = 1;

    if (messageCount === firstAIMessage) {
      await this.simulationRepository.updateSessionTopic(sessionId, message);
    }
    await this.simulationRepository.saveMessage(sessionId, message, 'user');
  }

  // AI 메시지 저장
  async saveAIMessage(sessionId: number, message: string): Promise<void> {
    await this.simulationRepository.saveMessage(sessionId, message, 'ai');
  }
}
