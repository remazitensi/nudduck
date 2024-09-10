/**
 * File Name    : user.module.ts
 * Description  : user 모듈 로직
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.10    이승철      Created
 */

import { FileUploadModule } from '@_file-upload/file-upload.module';
import { UserHashtag } from '@_user/entity/hashtag.entity';
import { User } from '@_user/entity/user.entity';
import { UserController } from '@_user/user.controller';
import { UserRepository } from '@_user/user.repository';
import { UserService } from '@_user/user.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserHashtag]), FileUploadModule],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService, UserRepository],
})
export class UserModule {}
