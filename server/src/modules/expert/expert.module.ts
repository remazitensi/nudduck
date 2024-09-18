/**
 * File Name    : expert.module.ts
 * Description  : expert 모듈 로직
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.14    이승철      Created
 * 2024.09.16    이승철      Modified    절대경로 변경
 */

import { Expert } from '@_modules/expert/entity/expert.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpertController } from '@_modules/expert/expert.controller';
import { ExpertService } from '@_modules/expert/expert.service';

@Module({
  imports: [TypeOrmModule.forFeature([Expert])],
  controllers: [ExpertController],
  providers: [ExpertService],
})
export class ExpertModule {}
