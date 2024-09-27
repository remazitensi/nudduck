/**
 * File Name    : simulation.module.ts
 * Description  : ai simulation 모듈
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.12    이승철      Created
 * 2024.09.16    이승철      Modified    절대경로 변경
 */

import { AIChatMessage, AIChatSession } from '@_modules/simulation/entity/ai-chat.entity';
import { SimulationController } from '@_modules/simulation/simulation.controller';
import { SimulationRepository } from '@_modules/simulation/simulation.repository';
import { SimulationService } from '@_modules/simulation/simulation.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([AIChatSession, AIChatMessage])],
  controllers: [SimulationController],
  providers: [SimulationService, SimulationRepository],
})
export class SimulationModule {}
