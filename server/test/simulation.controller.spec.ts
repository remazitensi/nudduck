/**
 * File Name    : simulation.controller.spec.ts
 * Description  : simulation 컨트롤러 테스트
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.16    이승철      Created
 */

import { AIChatHistoryDto } from '@_modules/simulation/dto/ai-chat-history.dto';
import { AIChatMessageDto } from '@_modules/simulation/dto/ai-chat-message.dto';
import { SimulationController } from '@_modules/simulation/simulation.controller';
import { SimulationService } from '@_modules/simulation/simulation.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('SimulationController', () => {
  let controller: SimulationController;
  let service: SimulationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SimulationController],
      providers: [
        {
          provide: SimulationService,
          useValue: {
            getUserSessions: jest.fn(),
            getSessionHistory: jest.fn(),
            handleSession: jest.fn(),
            getAIResponse: jest.fn(),
            createUserMessage: jest.fn(),
            createAIMessage: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<SimulationController>(SimulationController);
    service = module.get<SimulationService>(SimulationService);
  });

  describe('getUserHistory', () => {
    it('should return user chat session history', async () => {
      const mockHistory = [{ id: 1, userId: 123, topic: '면접', createdAt: new Date() }];
      (service.getUserSessions as jest.Mock).mockResolvedValue(mockHistory);

      const req = { user: { id: 123 } };
      const result: AIChatHistoryDto = await controller.getUserHistory(req);

      expect(service.getUserSessions).toHaveBeenCalledWith(123);
      expect(result.history).toEqual(mockHistory);
    });
  });

  describe('getSessionHistory', () => {
    it('should return session chat messages', async () => {
      const mockMessages = [{ id: 1, sessionId: 1, message: '랜덤 질문', sender: 'ai', createdAt: new Date() }];
      (service.getSessionHistory as jest.Mock).mockResolvedValue(mockMessages);

      const result: AIChatMessageDto = await controller.getSessionHistory(1);

      expect(service.getSessionHistory).toHaveBeenCalledWith(1);
      expect(result.messages).toEqual(mockMessages);
    });
  });

  describe('startChat', () => {
    it('should start a new chat session or return existing session', async () => {
      const mockSession = { id: 1, userId: 123, topic: null, createdAt: new Date() };
      (service.handleSession as jest.Mock).mockResolvedValue(mockSession);

      const req = { user: { id: 123 } };
      const result = await controller.startChat({ isNewChat: true }, req);

      expect(service.handleSession).toHaveBeenCalledWith(123, true);
      expect(result.sessionId).toEqual(1);
    });
  });

  describe('askAI', () => {
    it('should return AI response and save user and AI messages', async () => {
      const mockResponse = { Answer: 'My strength is persistence.' };
      (service.getAIResponse as jest.Mock).mockResolvedValue(mockResponse);

      const askAIDto = { query: 'What is your strength?', sessionId: 1 };
      const result = await controller.askAI(askAIDto);

      expect(service.getAIResponse).toHaveBeenCalledWith('What is your strength?');
      expect(service.createUserMessage).toHaveBeenCalledWith(1, 'What is your strength?');
      expect(service.createAIMessage).toHaveBeenCalledWith(1, 'My strength is persistence.');
      expect(result.answer).toEqual('My strength is persistence.');
    });
  });
});
