/**
 * File Name    : simulation.module.ts
 * Description  : ai simulation 모듈
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.12    이승철      Created
 */

import { AIChatMessage, AIChatSession } from '@_simulation/entity/ai-chat.entity';
import { SimulationController } from '@_simulation/simulation.controller';
import { SimulationRepository } from '@_simulation/simulation.repository';
import { SimulationService } from '@_simulation/simulation.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([AIChatSession, AIChatMessage])],
  controllers: [SimulationController],
  providers: [SimulationService, SimulationRepository],
})
export class SimulationModule {}
