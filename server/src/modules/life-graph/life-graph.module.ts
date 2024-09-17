import { LifeGraphEvent } from '@_modules/life-graph/entity/life-graph-events.entity';
import { LifeGraph } from '@_modules/life-graph/entity/life-graph.entity';
import { LifeGraphController } from '@_modules/life-graph/life-graph.controller';
import { LifeGraphRepository } from '@_modules/life-graph/life-graph.repository';
import { LifeGraphService } from '@_modules/life-graph/life-graph.service';
import { UserModule } from '@_modules/user/user.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([LifeGraph, LifeGraphEvent]), UserModule],
  controllers: [LifeGraphController],
  providers: [LifeGraphService, LifeGraphRepository],
})
export class LifeGraphModule {}
