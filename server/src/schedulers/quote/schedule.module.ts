/*
 * File Name    : schedule.module.ts
 * Description  : 스케쥴 모듈
 * Author       : 김재영
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.23    김재영      Created     스케쥴 모듈 생성
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnglishSentence } from './entities/english-sentence.entity';
import { Quote } from './entities/quote.entity';
import { QuoteScheduler } from './quote.scheduler';
import { ScheduleController } from './schedule.controller';
import { ScheduleService } from './schedule.service';

@Module({
  imports: [TypeOrmModule.forFeature([Quote, EnglishSentence])],
  controllers: [ScheduleController],
  providers: [ScheduleService, QuoteScheduler],
})
export class ScheduleModule {}
