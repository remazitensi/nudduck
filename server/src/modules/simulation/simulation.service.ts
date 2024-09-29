/**
 * File Name    : simulation.service.ts
 * Description  : simulation 서비스 로직
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.12    이승철      Created
 * 2024.09.16    이승철      Modified    절대경로 변경
 * 2024.09.29    이승철      Modified    HttpService 삽입
 * 2024.09.29    이승철      Modified    세션 삭제 로직 추가
 */

import { AIChatMessage, AIChatSession } from '@_modules/simulation/entity/ai-chat.entity';
import { SimulationRepository } from '@_modules/simulation/simulation.repository';
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios'; 
import { firstValueFrom } from 'rxjs';


@Injectable()
export class SimulationService {
  constructor(
    private readonly simulationRepository: SimulationRepository,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  // 특정 유저의 채팅 세션 조회
  async getUserSessions(userId: number): Promise<AIChatSession[]> {
    return this.simulationRepository.findUserSessions(userId);
  }

  // 특정 세션의 대화 기록 조회
  async getSessionHistory(sessionId: number): Promise<AIChatMessage[]> {
    return this.simulationRepository.findMessagesBySessionId(sessionId);
  }

  // 세션이 없을 경우 새로 시작하도록 로직 추가
  async handleSession(userId: number, isNewChat: boolean): Promise<AIChatSession> {
    if (isNewChat) {
      // 새로운 세션 시작
      const newSession = await this.createSession(userId);
      await this.createAIMessage(newSession.id, this.configService.get('FIRST_AI_MSG'));
      return newSession;
    } else {
      // 이전 세션 이어받기
      const lastSession = await this.getLastSession(userId);
      if (lastSession) {
        return lastSession;
      } else {
        // 세션이 없을 경우 새로 시작
        const newSession = await this.createSession(userId);
        await this.createAIMessage(newSession.id, this.configService.get('FIRST_AI_MSG'));
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
    const sessions = await this.simulationRepository.findUserSessions(userId);

    if (sessions.length > 0) {
      return sessions[0]; // 가장 최근 세션 반환
    }
    return null;
  }

  // AI 서버로 질문을 보내고 응답 받기 (예외 처리 추가)
  async getAIResponse(query: string): Promise<{ Answer: string }> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(this.configService.get('AI_QUERY_URL'), { query }),
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        // 서버가 4xx, 5xx 응답을 보낸 경우
        if (error.response.status >= 400 && error.response.status < 500) {
          throw new BadRequestException(`AI 서버 요청 실패: ${error.response.data.message || '잘못된 요청입니다.'}`);
        } else {
          throw new InternalServerErrorException(`AI 서버 에러: ${error.response.data.message || '서버에서 오류가 발생했습니다.'}`);
        }
      } else {
        // 서버가 응답하지 않거나 네트워크 문제가 발생한 경우
        throw new InternalServerErrorException('AI 서버와의 통신 오류가 발생했습니다.');
      }
    }
  }

  // 유저의 첫 번째 메시지를 주제로 설정하고 메시지 저장
  async createUserMessage(sessionId: number, message: string): Promise<void> {
    const messageCount = await this.simulationRepository.countMessagesBySessionId(sessionId);
    const firstAIMessageCount = 1;

    if (messageCount === firstAIMessageCount) {
      await this.simulationRepository.updateSessionTopic(sessionId, message);
    }
    await this.simulationRepository.createMessage(sessionId, message, 'user');
  }

  // AI 메시지 저장
  async createAIMessage(sessionId: number, message: string): Promise<void> {
    await this.simulationRepository.createMessage(sessionId, message, 'ai');
  }

  // 특정 세션 삭제 로직 추가
  async deleteSession(sessionId: number): Promise<void> {
    const session = await this.simulationRepository.findSessionById(sessionId);

    if (!session) {
      throw new BadRequestException(`세션을 찾을 수 없습니다. sessionId: ${sessionId}`);
    }

    try {
      // 세션의 메시지 먼저 삭제 후,
      await this.simulationRepository.deleteMessagesBySessionId(sessionId);
      // 세션 삭제
      await this.simulationRepository.deleteSession(sessionId); 
    } catch (error) {
      throw new InternalServerErrorException('세션 삭제 중 오류가 발생했습니다.');
    }
  }  
}
