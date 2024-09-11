/**
 * File Name    : app.module.ts
 * Description  : 애플리케이션 모듈
 * Author       : 김재영
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.06    김재영      Created     애플리케이션 모듈 초기 생성
 * 2024.09.09    김재영      Modified    커뮤니티 모듈 추가
 * 2024.09.10    김재영      Modified    TypeORM 및 RDS 설정 추가
 * 2024.09.11    김재영      Modified    SSL 제거
 */

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatController } from 'modules/chat/chat-controller';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommunityModule } from './modules/community/community.module';
import { ExpertController } from './modules/expert/expert-controller';
import { IntroController } from './modules/intro-controller';
import { LifeGraphController } from './modules/lifeGraph/life-graph-controller';
import { SimulationController } from './modules/simulation/simulation-controller';
import { UserController } from './modules/user/user-controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 글로벌로 환경 변수 사용
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // ConfigModule에서 환경 변수 가져오기
      inject: [ConfigService], // ConfigService 의존성 주입
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'), // DB 호스트
        port: configService.get<number>('DB_PORT'), // DB 포트
        username: configService.get<string>('DB_USER'), // DB 사용자명
        password: configService.get<string>('DB_PASSWORD'), // DB 비밀번호
        database: configService.get<string>('DB_NAME'), // DB 이름
        entities: [__dirname + '/**/*.entity{.ts,.js}'], // 엔티티 경로 설정
        synchronize: true, // 개발 환경에서만 true, 배포 환경에서는 false로 설정
        connectTimeout: 60000, // 타임아웃 설정
        extra: {}, // SSL 제외, 추가 설정 없음
        logging: true, // 모든 쿼리 로그 활성화
      }),
    }),
    CommunityModule, // 커뮤니티 모듈
  ],
  controllers: [AppController, IntroController, UserController, SimulationController, ChatController, ExpertController, LifeGraphController],
  providers: [AppService],
})
export class AppModule {}
