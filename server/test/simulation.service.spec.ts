/**
 * File Name    : simulation.service.spec.ts
 * Description  : simulation 서비스 테스트
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.16    이승철      Created
 * 2024.09.30    이승철      Modified    HttpService 삽입
 */

import { AIChatMessage, AIChatSession } from '@_modules/simulation/entity/ai-chat.entity';
import { SimulationRepository } from '@_modules/simulation/simulation.repository';
import { SimulationService } from '@_modules/simulation/simulation.service';
import { HttpService } from '@nestjs/axios';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { of, throwError } from 'rxjs';

describe('SimulationService', () => {
  let service: SimulationService;
  let repository: SimulationRepository;
  let httpService: HttpService;
  let configService: ConfigService;

  const mockSession: AIChatSession = { id: 1, userId: 1, topic: 'test', createdAt: new Date() };
  const mockMessage: AIChatMessage = { id: 1, sessionId: 1, message: 'Hello AI', sender: 'user', createdAt: new Date() };

  const mockRepository = {
    findUserSessions: jest.fn().mockResolvedValue([mockSession]),
    findMessagesBySessionId: jest.fn().mockResolvedValue([mockMessage]),
    createSession: jest.fn().mockResolvedValue(mockSession),
    countMessagesBySessionId: jest.fn().mockResolvedValue(1),
    updateSessionTopic: jest.fn().mockResolvedValue(undefined),
    createMessage: jest.fn().mockResolvedValue(mockMessage),
    findSessionById: jest.fn().mockResolvedValue(mockSession),
    deleteMessagesBySessionId: jest.fn().mockResolvedValue(undefined),
    deleteSession: jest.fn().mockResolvedValue(undefined),
  };

  const mockHttpService = {
    post: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'FIRST_AI_MSG') {
        return 'Hello! How can I assist you?';
      }
      if (key === 'AI_QUERY_URL') {
        return 'http://mock-ai-url.com';
      }
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SimulationService,
        { provide: SimulationRepository, useValue: mockRepository },
        { provide: HttpService, useValue: mockHttpService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<SimulationService>(SimulationService);
    repository = module.get<SimulationRepository>(SimulationRepository);
    httpService = module.get<HttpService>(HttpService);
    configService = module.get<ConfigService>(ConfigService);
  });

  describe('handleSession', () => {
    it('should create a new session and save the first AI message when isNewChat is true', async () => {
      const result = await service.handleSession(1, true);
      expect(repository.createSession).toHaveBeenCalledWith(1);
      expect(repository.createMessage).toHaveBeenCalledWith(mockSession.id, 'Hello! How can I assist you?', 'ai');
      expect(result).toEqual(mockSession);
    });

    it('should return the last session if isNewChat is false', async () => {
      const result = await service.handleSession(1, false);
      expect(repository.findUserSessions).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockSession);
    });
  });

  describe('getAIResponse', () => {
    it('should return AI response', async () => {
      const mockAIResponse = { data: { Answer: 'I am an AI' } };
      mockHttpService.post.mockReturnValueOnce(of(mockAIResponse));

      const result = await service.getAIResponse('What is your strength?');
      expect(httpService.post).toHaveBeenCalledWith('http://mock-ai-url.com', { query: 'What is your strength?' });
      expect(result).toEqual({ Answer: 'I am an AI' });
    });

    it('should throw a BadRequestException for 4xx errors', async () => {
      const mockError = { response: { status: 400, data: { message: 'Invalid query' } } };
      mockHttpService.post.mockReturnValueOnce(throwError(() => mockError));

      await expect(service.getAIResponse('Invalid query')).rejects.toThrow(BadRequestException);
    });

    it('should throw an InternalServerErrorException for 5xx errors', async () => {
      const mockError = { response: { status: 500, data: { message: 'Server error' } } };
      mockHttpService.post.mockReturnValueOnce(throwError(() => mockError));

      await expect(service.getAIResponse('What is your strength?')).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('createUserMessage', () => {
    it('should create a user message and update the session topic if it is the first message', async () => {
      await service.createUserMessage(1, 'First message');
      expect(repository.updateSessionTopic).toHaveBeenCalledWith(1, 'First message');
      expect(repository.createMessage).toHaveBeenCalledWith(1, 'First message', 'user');
    });
  });

  describe('deleteSession', () => {
    it('should delete a session and its messages', async () => {
      await service.deleteSession(1);
      expect(repository.findSessionById).toHaveBeenCalledWith(1);
      expect(repository.deleteMessagesBySessionId).toHaveBeenCalledWith(1);
      expect(repository.deleteSession).toHaveBeenCalledWith(1);
    });
  });
});
