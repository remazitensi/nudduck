/**
 * File Name    : life-graph.service.ts
 * Description  : life-graph service 로직
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.17    이승철      Created
 * 2024.09.17    이승철      절대경로로 변경
 * 2024.09.18    이승철      Modified    이벤트 제목 추가
 */

import { CreateLifeGraphDto } from '@_modules/life-graph/dto/create-life-graph.dto';
import { UpdateLifeGraphDto } from '@_modules/life-graph/dto/update-life-graph.dto';
import { LifeGraphRepository } from '@_modules/life-graph/life-graph.repository';
import { UserRepository } from '@_modules/user/user.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';
import { EventDto } from '@_modules/life-graph/dto/event.dto';
import { LifeGraphEvent } from '@_modules/life-graph/entity/life-graph-events.entity';
import { LifeGraph } from '@_modules/life-graph/entity/life-graph.entity';

@Injectable()
export class LifeGraphService {
  constructor(
    private readonly lifeGraphRepository: LifeGraphRepository,
    private readonly userRepository: UserRepository,
    private readonly dataSource: DataSource,
  ) {}

  async createNewLifeGraph(userId: number, createLifeGraphDto: CreateLifeGraphDto): Promise<void> {
    const user = await this.userRepository.findUserById(userId);

    const newLifeGraph = {
      user,
      current_age: createLifeGraphDto.currentAge,
      title: createLifeGraphDto.title,
      events: createLifeGraphDto.events.map((eventDto) => {
        const lifeGraphEvent = new LifeGraphEvent();
        lifeGraphEvent.age = eventDto.age;
        lifeGraphEvent.score = eventDto.score;
        lifeGraphEvent.title = eventDto.title;
        lifeGraphEvent.description = eventDto.description;
        return lifeGraphEvent;
      }),
      created_at: new Date(),
      updated_at: new Date(),
    };

    await this.lifeGraphRepository.createLifeGraph(newLifeGraph);
  }

  async getAllLifeGraph(userId: number, page: number, limit: number): Promise<{ data: LifeGraph[]; totalCount: number }> {
    page = Math.max(page, 1);
    const totalCount = await this.lifeGraphRepository.countLifeGraphs(userId);
    const totalPages = Math.ceil(totalCount / limit);
    if (page > totalPages) page = totalPages;

    const data = await this.lifeGraphRepository.findLifeGraphs(userId, page, limit);
    return { data, totalCount };
  }

  async getOneLifeGraph(userId: number, graphId: number): Promise<LifeGraph | null> {
    return this.lifeGraphRepository.findOneLifeGraph(userId, graphId, { relations: ['events'] });
  }

  async updateLifeGraph(userId: number, graphId: number, updateLifeGraphDto: UpdateLifeGraphDto): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const lifeGraph = await this.lifeGraphRepository.findOneLifeGraph(userId, graphId, { relations: ['events'] });

      if (!lifeGraph) {
        throw new NotFoundException('LifeGraph를 찾을 수 없습니다.');
      }

      // 수정된 제목과 나이 처리
      this.updateBasicInfo(lifeGraph, updateLifeGraphDto);

      // 이벤트 삭제 처리
      await this.handleDeletedEvents(updateLifeGraphDto.deletedEventIds, queryRunner);

      // 이벤트 수정 및 추가 처리
      this.updateEvents(lifeGraph, updateLifeGraphDto.events);

      // 변경 사항을 DB에 저장
      await queryRunner.manager.save(lifeGraph);

      // 트랜잭션 커밋
      await queryRunner.commitTransaction();
    } catch (error) {
      // 트랜잭션 롤백
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // QueryRunner 해제
      await queryRunner.release();
    }
  }

  // 제목과 나이 업데이트
  private updateBasicInfo(lifeGraph: LifeGraph, updateLifeGraphDto: UpdateLifeGraphDto): void {
    if (updateLifeGraphDto.currentAge) {
      lifeGraph.current_age = updateLifeGraphDto.currentAge;
    }
    if (updateLifeGraphDto.title) {
      lifeGraph.title = updateLifeGraphDto.title;
    }
  }

  // 삭제된 이벤트 처리 (QueryRunner 사용)
  private async handleDeletedEvents(deletedEventIds?: number[], queryRunner?: QueryRunner): Promise<void> {
    if (deletedEventIds && deletedEventIds.length > 0) {
      await queryRunner.manager.delete(LifeGraphEvent, deletedEventIds);
    }
  }

  // 이벤트 수정 및 추가 처리
  private updateEvents(lifeGraph: LifeGraph, events?: EventDto[]): void {
    if (!events) return;

    const updatedEvents = events.map((event) => {
      const existingEvent = lifeGraph.events.find((e) => e.id === event.id);

      if (!existingEvent) {
        // 새 이벤트 추가
        const newEvent = new LifeGraphEvent();
        newEvent.lifeGraph = lifeGraph;
        newEvent.age = event.age;
        newEvent.score = event.score;
        newEvent.title = event.title;
        newEvent.description = event.description;
        return newEvent;
      }

      // 기존 이벤트 또는 새 이벤트 업데이트
      existingEvent.age = event.age;
      existingEvent.score = event.score;
      existingEvent.title = event.title;
      existingEvent.description = event.description;
      return existingEvent;
    });

    lifeGraph.events = updatedEvents;
  }

  async deleteLifeGraph(userId: number, graphId: number): Promise<void> {
    const lifeGraph = await this.lifeGraphRepository.findOneLifeGraph(userId, graphId);

    if (!lifeGraph) {
      throw new NotFoundException('LifeGraph를 찾을 수 없거나 권한이 없습니다.');
    }

    await this.lifeGraphRepository.deleteLifeGraph(lifeGraph);
  }

  async toggleFavorite(userId: number, graphId: number): Promise<void> {
    const user = await this.userRepository.findUserById(userId);
    const lifeGraph = await this.lifeGraphRepository.findOneLifeGraph(userId, graphId);

    if (!lifeGraph) {
      throw new NotFoundException('LifeGraph를 찾을 수 없거나 권한이 없습니다.');
    }

    // 즐겨찾기 토글 로직
    if (user.favorite_life_graph?.id === graphId) {
      user.favorite_life_graph = null; // 이미 즐겨찾기 되어 있으면 해제
    } else {
      user.favorite_life_graph = lifeGraph; // 즐겨찾기로 설정
    }

    await this.userRepository.updateUser(user);
  }
}
