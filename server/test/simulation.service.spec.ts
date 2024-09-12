import { Test, TestingModule } from '@nestjs/testing';
import axios from 'axios';
import { SimulationRepository } from '../src/modules/simulation/simulation.repository';
import { SimulationService } from '../src/modules/simulation/simulation.service';
jest.mock('axios');

describe('SimulationService', () => {
  let service: SimulationService;
  let repository: SimulationRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SimulationService,
        {
          provide: SimulationRepository,
          useValue: {
            getUserSessions: jest.fn(),
            getMessagesBySessionId: jest.fn(),
            createSession: jest.fn(),
            saveMessage: jest.fn(),
            countMessagesBySessionId: jest.fn(),
            updateSessionTopic: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SimulationService>(SimulationService);
    repository = module.get<SimulationRepository>(SimulationRepository);
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
    jest.spyOn(repository, 'getUserSessions').mockResolvedValue(userSessionsMock);

    const result = await service.getUserSessions(1);
    expect(result).toEqual(userSessionsMock);
  });

  it('특정 세션의 대화 기록 조회', async () => {
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
    jest.spyOn(repository, 'getMessagesBySessionId').mockResolvedValue(sessionMessagesMock);

    const result = await service.getSessionHistory(1);
    expect(result).toEqual(sessionMessagesMock);
  });

  it('새로운 세션 생성 후 AI 첫 응답 저장', async () => {
    const sessionMock = {
      id: 1,
      userId: 1,
      topic: null,
      createdAt: new Date(),
    };
    jest.spyOn(repository, 'createSession').mockResolvedValue(sessionMock);
    jest.spyOn(service, 'saveAIMessage').mockResolvedValue(null);

    const result = await service.handleSession(1, true);
    expect(result).toEqual(sessionMock);
    expect(service.saveAIMessage).toHaveBeenCalledWith(sessionMock.id, '어떤 도움이 필요하시나요?');
  });

  it('AI 서버로 질문을 보내고 응답 받기', async () => {
    const aiResponseMock = { data: { Answer: 'Mock AI Answer' } };
    (axios.post as jest.Mock).mockResolvedValue(aiResponseMock);

    const result = await service.getAIResponse('Mock Query');
    expect(result.Answer).toEqual(aiResponseMock.data.Answer);
  });

  it('첫 번째 유저 메시지를 주제로 설정하고 메시지 저장', async () => {
    jest.spyOn(repository, 'countMessagesBySessionId').mockResolvedValue(1);
    jest.spyOn(repository, 'updateSessionTopic').mockResolvedValue(null);
    jest.spyOn(repository, 'saveMessage').mockResolvedValue(null);

    await service.saveUserMessage(1, 'Mock User Message');
    expect(repository.updateSessionTopic).toHaveBeenCalledWith(1, 'Mock User Message');
    expect(repository.saveMessage).toHaveBeenCalledWith(1, 'Mock User Message', 'user');
  });

  it('AI 메시지 저장', async () => {
    jest.spyOn(repository, 'saveMessage').mockResolvedValue(null);

    await service.saveAIMessage(1, 'Mock AI Message');
    expect(repository.saveMessage).toHaveBeenCalledWith(1, 'Mock AI Message', 'ai');
  });
});
