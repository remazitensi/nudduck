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
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommunityService } from './community.service';
import { CommunityController } from './community.controller';
import { Community } from './entities/community.entity';
import { Comment } from './entities/comment.entity';
import { PostRepository } from './repositories/post.repository';
import { CommentRepository } from './repositories/comment.repository';
import { UserRepository } from '@_modules/user/user.repository';
import { UserModule } from '@_modules/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Community, Comment, UserRepository]), UserModule],
  controllers: [CommunityController],
  providers: [CommunityService, PostRepository, CommentRepository],
  exports: [CommunityService, PostRepository, CommentRepository],
})
export class CommunityModule {}
