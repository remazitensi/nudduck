/**
 * File Name    : expert.controller.spec.ts
 * Description  : expert 컨트롤러 테스트
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.14    이승철      Created
 * 2024.09.30    이승철      Modified    페이지네이션 쿼리에 limit 추가
 */

import { Expert } from '@_modules/expert/entity/expert.entity';
import { ExpertController } from '@_modules/expert/expert.controller';
import { ExpertService } from '@_modules/expert/expert.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('ExpertController', () => {
  let controller: ExpertController;
  let expertService: ExpertService;

  const mockExpertService = {
    getExperts: jest.fn(),
    getExpertById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExpertController],
      providers: [{ provide: ExpertService, useValue: mockExpertService }],
    }).compile();

    controller = module.get<ExpertController>(ExpertController);
    expertService = module.get<ExpertService>(ExpertService);
  });

  describe('getExperts', () => {
    it('should return experts list with pagination', async () => {
      const result = {
        data: [new Expert()],
        totalCount: 1,
      };

      mockExpertService.getExperts.mockResolvedValue(result);

      const paginationQuery = { page: 1, limit: 10 };
      expect(await controller.getExperts(paginationQuery)).toBe(result);
      expect(expertService.getExperts).toHaveBeenCalledWith(paginationQuery);
    });
  });

  describe('getExpertById', () => {
    it('should return expert by id', async () => {
      const expert = new Expert();
      mockExpertService.getExpertById.mockResolvedValue(expert);

      expect(await controller.getExpertById(1)).toBe(expert);
      expect(expertService.getExpertById).toHaveBeenCalledWith(1);
    });
  });
});
