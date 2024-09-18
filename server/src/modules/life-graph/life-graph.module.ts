/**
 * File Name    : life-graph.module.ts
 * Description  : life-graph 모듈 로직
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.17    이승철      Created
 * 2024.09.18    이승철      Modified    인생그래프 이벤트 서비스 삽입
 */

import { LifeGraphEvent } from '@_modules/life-graph/entity/life-graph-events.entity';
import { LifeGraph } from '@_modules/life-graph/entity/life-graph.entity';
import { LifeGraphController } from '@_modules/life-graph/life-graph.controller';
import { LifeGraphRepository } from '@_modules/life-graph/life-graph.repository';
import { LifeGraphService } from '@_modules/life-graph/life-graph.service';
import { UserModule } from '@_modules/user/user.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LifeGraphEventService } from '@_modules/life-graph/life-graph-event.service';

@Module({
  imports: [TypeOrmModule.forFeature([LifeGraph, LifeGraphEvent]), UserModule],
  controllers: [LifeGraphController],
  providers: [LifeGraphService, LifeGraphRepository, LifeGraphEventService],
})
export class LifeGraphModule {}
