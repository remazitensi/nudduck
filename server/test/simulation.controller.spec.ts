import { Test, TestingModule } from '@nestjs/testing';
import { SimulationController } from '../src/modules/simulation/simulation.controller';
import { SimulationService } from '../src/modules/simulation/simulation.service';

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
            saveUserMessage: jest.fn(),
            saveAIMessage: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<SimulationController>(SimulationController);
    service = module.get<SimulationService>(SimulationService);
  });

  it('유저의 채팅 세션 목록 조회', async () => {
    const userSessionsMock = [
      {
        id: 1,
        userId: 1,
        topic: 'Mock Session',
        createdAt: new Date(),
      },
    ];
    jest.spyOn(service, 'getUserSessions').mockResolvedValue(userSessionsMock);

    const req = { user: { id: 1 } };
    const result = await controller.getUserHistory(req);

    expect(result.history).toEqual(userSessionsMock);
  });

  it('특정 채팅 세션의 대화 기록 조회', async () => {
    const sessionMessagesMock = [
      {
        id: 1,
        sessionId: 1,
        message: 'Mock Message',
        sender: 'user' as 'user',
        createdAt: new Date(),
      },
      {
        id: 2,
        sessionId: 1,
        message: 'Mock AI Response',
        sender: 'ai' as 'ai',
        createdAt: new Date(),
      },
    ];
    jest.spyOn(service, 'getSessionHistory').mockResolvedValue(sessionMessagesMock);

    const result = await controller.getSessionHistory(1);
    expect(result.messages).toEqual(sessionMessagesMock);
  });

  it('새로운 세션 시작', async () => {
    const sessionMock = {
      id: 1,
      userId: 1,
      topic: null,
      createdAt: new Date(),
    };
    jest.spyOn(service, 'handleSession').mockResolvedValue(sessionMock);

    const startAIDto = { startNewChat: true };
    const req = { user: { id: 1 } };
    const result = await controller.startChat(startAIDto, req);

    expect(result.sessionId).toEqual(sessionMock.id);
  });

  it('AI 질문에 대한 응답 생성 및 저장', async () => {
    const aiResponseMock = { Answer: 'Mock AI Answer' };
    jest.spyOn(service, 'getAIResponse').mockResolvedValue(aiResponseMock);
    jest.spyOn(service, 'saveUserMessage').mockResolvedValue(null);
    jest.spyOn(service, 'saveAIMessage').mockResolvedValue(null);

    const askAIDto = { query: 'Mock Query', sessionId: 1 };
    const result = await controller.askAI(askAIDto);

    expect(result.query).toEqual(askAIDto.query);
    expect(result.answer).toEqual(aiResponseMock.Answer);
  });
});
