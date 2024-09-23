/**
 * File Name    : community.module.ts
 * Description  : 커뮤니티 모듈
 * Author       : 김재영
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.07    김재영      Created     커뮤니티 모듈 초기 생성
 * 2024.09.09    김재영      Modified    커뮤니티 서비스 및 컨트롤러 연결
 * 2024.09.10    김재영      Modified    TypeORM을 통한 RDS 연동 설정
 * 2024.09.19    김재영      Modified    전체적인 커뮤니티 기능 추가
 * 2024.09.23    이승철      Modified    UserModule에 forwardRef 추가
 */

import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommunityService } from '@_modules/community/community.service';
import { CommunityController } from '@_modules/community/community.controller';
import { Community } from '@_modules/community/entities/community.entity';
import { Comment } from '@_modules/community/entities/comment.entity';
import { CommunityRepository } from './repositories/community.repository';
import { CommentRepository } from '@_modules/community/repositories/comment.repository';
import { UserRepository } from '@_modules/user/user.repository';
import { UserModule } from '@_modules/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Community, Comment, UserRepository]), forwardRef(() => UserModule)],
  controllers: [CommunityController],
  providers: [CommunityService, CommunityRepository, CommentRepository],
  exports: [CommunityService, CommunityRepository, CommentRepository],
})
export class CommunityModule {}
