/**
 * File Name    : expert.module.ts
 * Description  : expert 모듈 로직
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.14    이승철      Created
 */

import { Expert } from '@_expert/entity/expert.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpertController } from './expert.controller';
import { ExpertRepository } from './expert.repository';
import { ExpertService } from './expert.service';

@Module({
  imports: [TypeOrmModule.forFeature([Expert])],
  controllers: [ExpertController],
  providers: [ExpertService, ExpertRepository],
})
export class ExpertModule {}
