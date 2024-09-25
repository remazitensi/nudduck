/**
 * File Name    : life-graph-event.service.ts
 * Description  : life-graph-event service 로직
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.18    이승철      Created
 */

import { Injectable } from '@nestjs/common';
import { QueryRunner } from 'typeorm';
import { LifeGraphEvent } from '@_modules/life-graph/entity/life-graph-events.entity';
import { EventDto } from '@_modules/life-graph/dto/event.dto';
import { LifeGraph } from '@_modules/life-graph/entity/life-graph.entity';

@Injectable()
export class LifeGraphEventService {
    // 모든 이벤트 삭제
    async deleteAllEvents(lifeGraph: LifeGraph, queryRunner: QueryRunner): Promise<void> {
      await queryRunner.manager.delete(LifeGraphEvent, { lifeGraph });
    }
  
    // 이벤트 생성
    createEvents(lifeGraph: LifeGraph, events?: EventDto[]): LifeGraphEvent[] {
      if (!events) return [];
  
      return events.map((event) => {
        return this.createNewEvent(lifeGraph, event);
      });
    }
  
    private createNewEvent(lifeGraph: LifeGraph, event: EventDto): LifeGraphEvent {
      const newEvent = new LifeGraphEvent();
      newEvent.lifeGraph = lifeGraph;
      newEvent.age = event.age;
      newEvent.score = event.score;
      newEvent.title = event.title;
      newEvent.description = event.description;
      return newEvent;
    }
  }