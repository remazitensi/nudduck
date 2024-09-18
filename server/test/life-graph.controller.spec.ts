/**
 * File Name    : life-graph.controller.ts
 * Description  : life-graph controller 테스트
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.18    이승철      Created
 * 2024.09.18    이승철      인생그래프 즐겨찾기 이름 변경
 */

import { Test, TestingModule } from '@nestjs/testing';
import { LifeGraphController } from '@_modules/life-graph/life-graph.controller';
import { LifeGraphService } from '@_modules/life-graph/life-graph.service';
import { CreateLifeGraphDto } from '@_modules/life-graph/dto/create-life-graph.dto';
import { UpdateLifeGraphDto } from '@_modules/life-graph/dto/update-life-graph.dto';
import { LifeGraphPageDto } from '@_modules/life-graph/dto/life-graph-page.dto';
import { UserRequest } from 'common/interfaces/user-request.interface';

describe('LifeGraphController', () => {
  let controller: LifeGraphController;
  let mockLifeGraphService: Partial<LifeGraphService>;

  beforeEach(async () => {
    mockLifeGraphService = {
      createNewLifeGraph: jest.fn(),
      getAllLifeGraph: jest.fn(),
      getOneLifeGraph: jest.fn(),
      updateLifeGraph: jest.fn(),
      deleteLifeGraph: jest.fn(),
      createFavoriteLifeGraph: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [LifeGraphController],
      providers: [{ provide: LifeGraphService, useValue: mockLifeGraphService }],
    }).compile();

    controller = module.get<LifeGraphController>(LifeGraphController);
  });

  describe('createLifeGraph', () => {
    it('should create a life graph', async () => {
      const req = { user: { id: 1 } } as UserRequest;
      const createLifeGraphDto: CreateLifeGraphDto = {
        currentAge: 25,
        title: 'My Life Graph',
        events: [{ age: 10, score: 4, title: 'Started school', description: 'Started elementary school' }],
      };

      await controller.createLifeGraph(req, createLifeGraphDto);
      expect(mockLifeGraphService.createNewLifeGraph).toHaveBeenCalledWith(1, createLifeGraphDto);
    });
  });

  describe('getAllLifeGraphs', () => {
    it('should return all life graphs', async () => {
      const req = { user: { id: 1 } } as UserRequest;
      const pageDto: LifeGraphPageDto = { page: 1 };
      const expectedResponse = { data: [], totalCount: 0 };

      (mockLifeGraphService.getAllLifeGraph as jest.Mock).mockResolvedValue(expectedResponse);

      const result = await controller.getAllLifeGraphs(req, pageDto);
      expect(result).toEqual(expectedResponse);
      expect(mockLifeGraphService.getAllLifeGraph).toHaveBeenCalledWith(1, 1, 6);
    });
  });

  describe('getOneLifeGraph', () => {
    it('should return one life graph', async () => {
      const req = { user: { id: 1 } } as UserRequest;
      const lifeGraph = { id: 1, title: 'My Life Graph' };

      (mockLifeGraphService.getOneLifeGraph as jest.Mock).mockResolvedValue(lifeGraph);

      const result = await controller.getOneLifeGraph(1, req);
      expect(result).toEqual(lifeGraph);
      expect(mockLifeGraphService.getOneLifeGraph).toHaveBeenCalledWith(1, 1);
    });
  });

  describe('updateLifeGraph', () => {
    it('should update a life graph', async () => {
      const req = { user: { id: 1 } } as UserRequest;
      const updateDto: UpdateLifeGraphDto = { title: 'Updated Life Graph' };

      await controller.updateLifeGraph(req, 1, updateDto);
      expect(mockLifeGraphService.updateLifeGraph).toHaveBeenCalledWith(1, 1, updateDto);
    });
  });

  describe('deleteLifeGraph', () => {
    it('should delete a life graph', async () => {
      const req = { user: { id: 1 } } as UserRequest;

      await controller.deleteLifeGraph(req, 1);
      expect(mockLifeGraphService.deleteLifeGraph).toHaveBeenCalledWith(1, 1);
    });
  });

  describe('addFavorite', () => {
    it('should toggle favorite for a life graph', async () => {
      const req = { user: { id: 1 } } as UserRequest;
      const favoriteDto = { graphId: 1 };

      await controller.createFavoriteLifeGraph(req, favoriteDto);
      expect(mockLifeGraphService.createFavoriteLifeGraph).toHaveBeenCalledWith(1, 1);
    });
  });
});
