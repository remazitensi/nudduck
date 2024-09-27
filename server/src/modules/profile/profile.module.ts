/**
 * File Name    : profile.module.ts
 * Description  : profile 모듈 로직
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.17    이승철      Created
 * 2024.09.21    이승철      Modified    lifeGraph 모듈 주입
 */

import { LifeGraphModule } from '@_modules/life-graph/life-graph.module';
import { ProfileController } from '@_modules/profile/profile.controller';
import { ProfileService } from '@_modules/profile/profile.service';
import { UserModule } from '@_modules/user/user.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [UserModule, LifeGraphModule],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
