/**
 * File Name    : simulation.service.spec.ts
 * Description  : simulation 서비스 테스트
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.16    이승철      Created
 */

import { SimulationRepository } from '@_modules/simulation/simulation.repository';
import { SimulationService } from '@_modules/simulation/simulation.service';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import axios from 'axios';

jest.mock('axios');

describe('SimulationService', () => {
  let service: SimulationService;
  let repository: SimulationRepository;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SimulationService,
        {
          provide: SimulationRepository,
          useValue: {
            findUserSessions: jest.fn(),
            findMessagesBySessionId: jest.fn(),
            createSession: jest.fn(),
            createMessage: jest.fn(),
            updateSessionTopic: jest.fn(),
            countMessagesBySessionId: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('FIRST_AI_MSG'),
          },
        },
      ],
    }).compile();

    service = module.get<SimulationService>(SimulationService);
    repository = module.get<SimulationRepository>(SimulationRepository);
    configService = module.get<ConfigService>(ConfigService);
  });

  describe('getUserSessions', () => {
    it('should return user sessions', async () => {
      const mockSessions = [{ id: 1, userId: 123, topic: '면접', createdAt: new Date() }];
      repository.findUserSessions = jest.fn().mockResolvedValue(mockSessions);

      const result = await service.getUserSessions(123);

      expect(repository.findUserSessions).toHaveBeenCalledWith(123);
      expect(result).toEqual(mockSessions);
    });
  });

  describe('getSessionHistory', () => {
    it('should return session messages', async () => {
      const mockMessages = [{ id: 1, sessionId: 1, message: 'Hello', sender: 'ai', createdAt: new Date() }];
      repository.findMessagesBySessionId = jest.fn().mockResolvedValue(mockMessages);

      const result = await service.getSessionHistory(1);

      expect(repository.findMessagesBySessionId).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockMessages);
    });
  });

  describe('getAIResponse', () => {
    it('should return AI response', async () => {
      const mockResponse = { data: { Answer: 'My strength is persistence.' } };
      (axios.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await service.getAIResponse('What is your strength?');

      expect(axios.post).toHaveBeenCalledWith('FIRST_AI_MSG', { query: 'What is your strength?' });
      expect(result.Answer).toEqual('My strength is persistence.');
    });

    it('should throw BadRequestException for 4xx errors', async () => {
      const mockError = {
        response: { status: 400, data: { message: 'Invalid request' } },
      };
      (axios.post as jest.Mock).mockRejectedValue(mockError);

      await expect(service.getAIResponse('Invalid query')).rejects.toThrow(BadRequestException);
    });

    it('should throw InternalServerErrorException for 5xx errors', async () => {
      const mockError = {
        response: { status: 500, data: { message: 'Server error' } },
      };
      (axios.post as jest.Mock).mockRejectedValue(mockError);

      await expect(service.getAIResponse('Valid query')).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('createUserMessage', () => {
    it('should set the first message as the session topic', async () => {
      repository.countMessagesBySessionId = jest.fn().mockResolvedValue(1);
      repository.updateSessionTopic = jest.fn().mockResolvedValue(undefined);

      await service.createUserMessage(1, 'First message');

      expect(repository.countMessagesBySessionId).toHaveBeenCalledWith(1);
      expect(repository.updateSessionTopic).toHaveBeenCalledWith(1, 'First message');
      expect(repository.createMessage).toHaveBeenCalledWith(1, 'First message', 'user');
    });
  });
});
