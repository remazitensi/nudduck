import { ExpertController } from '@_expert/expert.controller';
import { ExpertService } from '@_expert/expert.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('ExpertController', () => {
  let controller: ExpertController;
  let service: ExpertService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExpertController],
      providers: [
        {
          provide: ExpertService,
          useValue: {
            getExperts: jest.fn(),
            getExpertById: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ExpertController>(ExpertController);
    service = module.get<ExpertService>(ExpertService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call getExperts from the service', async () => {
    const result = { data: [], totalCount: 0 };
    jest.spyOn(service, 'getExperts').mockResolvedValue(result);

    expect(await controller.getExperts({ page: 1 })).toBe(result);
  });

  it('should call getExpertById from the service', async () => {
    const result = { id: 1, name: 'Test Expert' } as any;
    jest.spyOn(service, 'getExpertById').mockResolvedValue(result);

    expect(await controller.getExpertById(1)).toBe(result);
  });
});
