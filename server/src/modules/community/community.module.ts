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
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommunityService } from './community.service';
import { CommunityController } from './community.controller';
import { Community } from './entities/community.entity'; // Community 엔티티 추가
import { Comment } from './entities/comment.entity'; // Comment 엔티티 추가

@Module({
  imports: [
    TypeOrmModule.forFeature([Community, Comment]), // TypeORM 모듈에 엔티티 등록
  ],
  controllers: [CommunityController],
  providers: [CommunityService],
})
export class CommunityModule {}
