/**
 * File Name    : life-graph.service.ts
 * Description  : life-graph service 테스트
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.18    이승철      Created
 * 2024.09.18    이승철      Modified    인생그래프 이벤트 Full Replacement Update로 변경 반영
 */

import { Test, TestingModule } from '@nestjs/testing';
import { LifeGraphService } from '@_modules/life-graph/life-graph.service';
import { LifeGraphRepository } from '@_modules/life-graph/life-graph.repository';
import { UserRepository } from '@_modules/user/user.repository';
import { NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateLifeGraphDto } from '@_modules/life-graph/dto/create-life-graph.dto';
import { UpdateLifeGraphDto } from '@_modules/life-graph/dto/update-life-graph.dto';
import { LifeGraphEvent } from '@_modules/life-graph/entity/life-graph-events.entity';
import { LifeGraphEventService } from '@_modules/life-graph/life-graph-event.service';

describe('LifeGraphService', () => {
  let service: LifeGraphService;
  let mockLifeGraphRepository: Partial<LifeGraphRepository>;
  let mockUserRepository: Partial<UserRepository>;
  let mockDataSource: Partial<DataSource>;
  let mockLifeGraphEventService: Partial<LifeGraphEventService>;

  beforeEach(async () => {
    mockLifeGraphRepository = {
      createLifeGraph: jest.fn(),
      findLifeGraphs: jest.fn(),
      countLifeGraphs: jest.fn(),
      findOneLifeGraph: jest.fn(),
      deleteLifeGraph: jest.fn(),
    };

    mockUserRepository = {
      findUserById: jest.fn(),
    };

    mockDataSource = {
      createQueryRunner: jest.fn().mockReturnValue({
        connect: jest.fn(),
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        release: jest.fn(),
        manager: {
          save: jest.fn(),
          delete: jest.fn(),
        },
      }),
    };

    mockLifeGraphEventService = {
      deleteAllEvents: jest.fn(),
      createEvents: jest.fn().mockReturnValue([]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LifeGraphService,
        { provide: LifeGraphRepository, useValue: mockLifeGraphRepository },
        { provide: UserRepository, useValue: mockUserRepository },
        { provide: DataSource, useValue: mockDataSource },
        { provide: LifeGraphEventService, useValue: mockLifeGraphEventService }
      ],
    }).compile();

    service = module.get<LifeGraphService>(LifeGraphService);
  });

  describe('createNewLifeGraph', () => {
    it('should create a new life graph', async () => {
      const user = { id: 1 };
      const createLifeGraphDto: CreateLifeGraphDto = {
        currentAge: 25,
        title: 'My Life Graph',
        events: [{ age: 10, score: 4, title: 'Started school', description: 'Started elementary school' }],
      };

      (mockUserRepository.findUserById as jest.Mock).mockResolvedValue(user);
      await service.createNewLifeGraph(1, createLifeGraphDto);

      expect(mockLifeGraphRepository.createLifeGraph).toHaveBeenCalled();
    });
  });

  describe('getAllLifeGraph', () => {
    it('should return all life graphs', async () => {
      (mockLifeGraphRepository.findLifeGraphs as jest.Mock).mockResolvedValue([]);
      (mockLifeGraphRepository.countLifeGraphs as jest.Mock).mockResolvedValue(0);

      const result = await service.getAllLifeGraph(1, 1, 6);
      expect(result).toEqual({ data: [], totalCount: 0 });
    });
  });

  describe('getOneLifeGraph', () => {
    it('should return one life graph', async () => {
      const lifeGraph = { id: 1, title: 'My Life Graph' };
      (mockLifeGraphRepository.findOneLifeGraph as jest.Mock).mockResolvedValue(lifeGraph);

      const result = await service.getOneLifeGraph(1, 1);
      expect(result).toEqual(lifeGraph);
    });

    it('should throw a NotFoundException if life graph is not found', async () => {
      (mockLifeGraphRepository.findOneLifeGraph as jest.Mock).mockResolvedValue(null);

      await expect(service.getOneLifeGraph(1, 1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateLifeGraph', () => {
    it('should update a life graph with new events', async () => {
      const lifeGraph = { id: 1, title: 'My Life Graph', events: [] };
      const updateLifeGraphDto: UpdateLifeGraphDto = { title: 'Updated Life Graph', events: [{ age: 10, score: 4, title: 'New Event', description: 'Description of new event' }] };
  
      (mockLifeGraphRepository.findOneLifeGraph as jest.Mock).mockResolvedValue(lifeGraph);
      const queryRunner = mockDataSource.createQueryRunner();

      queryRunner.manager.delete = jest.fn().mockResolvedValue(true);
      queryRunner.manager.save = jest.fn().mockResolvedValue(true);
  
      await service.updateLifeGraph(1, 1, updateLifeGraphDto);

      expect(mockLifeGraphEventService.deleteAllEvents).toHaveBeenCalledWith(lifeGraph, queryRunner);
      expect(mockLifeGraphEventService.createEvents).toHaveBeenCalledWith(lifeGraph, updateLifeGraphDto.events);
      expect(queryRunner.manager.save).toHaveBeenCalledWith(lifeGraph);
      expect(queryRunner.commitTransaction).toHaveBeenCalled();
    });
  });

  describe('deleteLifeGraph', () => {
    it('should delete a life graph', async () => {
      const lifeGraph = { id: 1 };

      (mockLifeGraphRepository.findOneLifeGraph as jest.Mock).mockResolvedValue(lifeGraph);
      await service.deleteLifeGraph(1, 1);

      expect(mockLifeGraphRepository.deleteLifeGraph).toHaveBeenCalledWith(lifeGraph);
    });

    it('should throw a NotFoundException if life graph is not found', async () => {
      (mockLifeGraphRepository.findOneLifeGraph as jest.Mock).mockResolvedValue(null);

      await expect(service.deleteLifeGraph(1, 1)).rejects.toThrow(NotFoundException);
    });
  });
});

