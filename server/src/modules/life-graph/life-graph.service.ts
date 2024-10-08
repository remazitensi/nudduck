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
 * 2024.09.18    이승철      Modified    예외처리
 * 2024.09.18    이승철      Modified    불필요한 코드 제거 및 인생그래프 이벤트 책임분리
 * 2024.09.18    이승철      Modified    인생그래프 이벤트 Full Replacement Update로 변경
 * 2024.09.23    이승철      Modified    인생그래프 개수가 0일 경우 조건문 추가
 * 2024.09.24    이승철      Modified    카멜케이스로 변경
 * 2024.09.24    이승철      Modified    limit를 dto에 추가
 * 2024.09.26    이승철      Modified    즐겨찾기 반환 값 및 age 검증 추가
 * 2024.09.29    이승철      Modified    병렬처리
 */

import { CreateLifeGraphDto } from '@_modules/life-graph/dto/create-life-graph.dto';
import { UpdateLifeGraphDto } from '@_modules/life-graph/dto/update-life-graph.dto';
import { LifeGraphRepository } from '@_modules/life-graph/life-graph.repository';
import { UserRepository } from '@_modules/user/user.repository';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { LifeGraphEvent } from '@_modules/life-graph/entity/life-graph-events.entity';
import { LifeGraph } from '@_modules/life-graph/entity/life-graph.entity';
import { LifeGraphEventService } from '@_modules/life-graph/life-graph-event.service';
import { LifeGraphPaginationQueryDto } from '@_modules/life-graph/dto/life-graph-pagination-query.dto';
import { LifeGraphListResponseDto, LifeGraphResponseDto } from '@_modules/life-graph/dto/life-graph-response.dto';

@Injectable()
export class LifeGraphService {
  constructor(
    private readonly lifeGraphRepository: LifeGraphRepository,
    private readonly userRepository: UserRepository,
    private readonly lifeGraphEventService: LifeGraphEventService,
    private readonly dataSource: DataSource,
  ) {}

  // 인생 그래프 생성
  async createNewLifeGraph(userId: number, createLifeGraphDto: CreateLifeGraphDto): Promise<void> {
    const user = await this.userRepository.findUserById(userId);

    createLifeGraphDto.events.forEach(eventDto => {
      if (createLifeGraphDto.currentAge < eventDto.age) {
        throw new BadRequestException('현재 나이는 이벤트 나이보다 낮을 수 없습니다.');
      }
    });
    
    const newLifeGraph = {
      user,
      currentAge: createLifeGraphDto.currentAge,
      title: createLifeGraphDto.title,
      events: createLifeGraphDto.events.map((eventDto) => {
        const lifeGraphEvent = new LifeGraphEvent();
        lifeGraphEvent.age = eventDto.age;
        lifeGraphEvent.score = eventDto.score;
        lifeGraphEvent.title = eventDto.title;
        lifeGraphEvent.description = eventDto.description;
        return lifeGraphEvent;
      }),
    };

    await this.lifeGraphRepository.createLifeGraph(newLifeGraph);
  }

  // 전체 인생 그래프 조회
  async getAllLifeGraph(userId: number, lifeGraphPaginationQueryDto: LifeGraphPaginationQueryDto): Promise<LifeGraphListResponseDto> {
    // 사용자의 즐겨찾기된 인생 그래프 가져오기
    const user = await this.userRepository.findUserById(userId, ['favoriteLifeGraph']);
    const favoriteGraphId = user.favoriteLifeGraph?.id || null;
    
    // 페이징 처리
    const { page, limit } = lifeGraphPaginationQueryDto;
    const actualPage = Math.max(page, 1);
    const totalCount = await this.lifeGraphRepository.countLifeGraphs(userId);
    const totalPages = Math.ceil(totalCount / limit);

    const finalPage = totalPages === 0 ? 1 : Math.min(actualPage, totalPages);

    const data = await this.lifeGraphRepository.findLifeGraphs(userId, finalPage, limit);
    return { data, totalCount, favoriteGraphId };
  }

  // 특정 인생 그래프 조회
  async getOneLifeGraph(userId: number, graphId: number): Promise<LifeGraphResponseDto> {
    const lifeGraph = await this.lifeGraphRepository.findOneLifeGraph(userId, graphId, { relations: ['events'] });
    if (!lifeGraph) {
      throw new NotFoundException();
    }
    return lifeGraph;
  }

  // 인생 그래프 수정
  async updateLifeGraph(userId: number, graphId: number, updateLifeGraphDto: UpdateLifeGraphDto): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const lifeGraph = await this.lifeGraphRepository.findOneLifeGraph(userId, graphId, { relations: ['events'] });

      if (!lifeGraph) {
        throw new NotFoundException();
      }

      if (updateLifeGraphDto.events) {
        updateLifeGraphDto.events.forEach(eventDto => {
          if (updateLifeGraphDto.currentAge < eventDto.age) {
            throw new BadRequestException('현재 나이는 이벤트 나이보다 낮을 수 없습니다.');
          }
        });
      } 

      // 수정된 제목과 나이 처리
      this.updateBasicInfo(lifeGraph, updateLifeGraphDto);

      // 기존 이벤트 전체 삭제
      await this.lifeGraphEventService.deleteAllEvents(lifeGraph, queryRunner);

      // 이벤트 추가 처리
      lifeGraph.events = this.lifeGraphEventService.createEvents(lifeGraph, updateLifeGraphDto.events);

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
      lifeGraph.currentAge = updateLifeGraphDto.currentAge;
    }
    if (updateLifeGraphDto.title) {
      lifeGraph.title = updateLifeGraphDto.title;
    }
  }

  // 인생 그래프 삭제
  async deleteLifeGraph(userId: number, graphId: number): Promise<void> {
    const lifeGraph = await this.lifeGraphRepository.findOneLifeGraph(userId, graphId);
    if (!lifeGraph) {
      throw new NotFoundException();
    }
    await this.lifeGraphRepository.deleteLifeGraph(lifeGraph);
  }

  // 인생 그래프 즐겨찾기 등록/해제
  async createFavoriteLifeGraph(userId: number, graphId: number): Promise<boolean> {
    const [user, lifeGraph] = await Promise.all([
      this.userRepository.findUserById(userId, ['favoriteLifeGraph']),
      this.lifeGraphRepository.findOneLifeGraph(userId, graphId),
    ]);
  
    if (!lifeGraph) {
      throw new NotFoundException('인생 그래프를 찾을 수 없습니다.');
    }
  
    const isAlreadyFavorited = user.favoriteLifeGraph?.id === graphId;
  
    if (isAlreadyFavorited) {
      user.favoriteLifeGraph = null; // 즐겨찾기 해제
    } else {
      user.favoriteLifeGraph = lifeGraph; // 즐겨찾기 등록
    }
  
    await this.userRepository.updateUser(user);
  
    return !isAlreadyFavorited; // 등록되면 true, 해제되면 false
  }
}
