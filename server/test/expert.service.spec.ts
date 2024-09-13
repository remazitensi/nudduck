// expert.service.spec.ts
import { Expert } from '@_expert/entity/expert.entity';
import { ExpertRepository } from '@_expert/expert.repository';
import { ExpertService } from '@_expert/expert.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('ExpertService', () => {
  let service: ExpertService;
  let repository: ExpertRepository;

  const mockExpertRepository = {
    findTotalCount: jest.fn().mockResolvedValue(1),
    findExperts: jest.fn().mockResolvedValue([]),
    findExpertById: jest.fn().mockResolvedValue({}),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExpertService,
        {
          provide: ExpertRepository,
          useValue: mockExpertRepository,
        },
      ],
    }).compile();

    service = module.get<ExpertService>(ExpertService);
    repository = module.get<ExpertRepository>(ExpertRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getExperts', () => {
    it('should return a list of experts and total count', async () => {
      const result = { data: [], totalCount: 1 };
      jest.spyOn(repository, 'findExperts').mockResolvedValue([]);
      jest.spyOn(repository, 'findTotalCount').mockResolvedValue(1);

      expect(await service.getExperts(1, 10)).toEqual(result);
    });
  });

  describe('getExpertById', () => {
    it('should return a single expert by id', async () => {
      const mockExpert: Expert = {
        id: 1,
        name: 'John Doe',
        jobTitle: 'Doctor',
        age: 40,
        bio: 'Experienced doctor',
        profileImage: 'image-url',
        email: 'john.doe@example.com',
        phone: '1234567890',
        cost: 100,
        hashtags: '#doctor',
      };

      jest.spyOn(repository, 'findExpertById').mockResolvedValue(mockExpert);

      expect(await service.getExpertById(1)).toEqual(mockExpert);
    });
  });
});
