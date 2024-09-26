/**
 * File Name    : user.module.ts
 * Description  : user 모듈 로직
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.10    이승철      Created
 * 2024.09.16    이승철      Modified    절대경로 변경
 * 2024.09.21    이승철      Modified    lifeGraph 모듈 주입
 * 2024.09.24    이승철      Modified    community 모듈 주입
 * 2024.09.26    이승철      Modified    community 모듈 주입 수정
 */

import { Community } from '@_modules/community/entities/community.entity';
import { FileUploadModule } from '@_modules/file-upload/file-upload.module';
import { LifeGraphModule } from '@_modules/life-graph/life-graph.module';
import { UserHashtag } from '@_modules/user/entity/hashtag.entity';
import { User } from '@_modules/user/entity/user.entity';
import { UserController } from '@_modules/user/user.controller';
import { UserRepository } from '@_modules/user/user.repository';
import { UserService } from '@_modules/user/user.service';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserHashtag, Community]), FileUploadModule, forwardRef(() => LifeGraphModule)],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService, UserRepository],
})
export class UserModule {}
