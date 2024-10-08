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
 * 2024.09.11    김재영      Modified    SSH 터널링 설정 추가
 */

import { AuthModule } from '@_modules/auth/auth.module';
import { CommunityModule } from '@_modules/community/community.module';
import { ExpertModule } from '@_modules/expert/expert.module';
import { FileUploadModule } from '@_modules/file-upload/file-upload.module';
import { LifeGraphModule } from '@_modules/life-graph/life-graph.module';
import { ProfileModule } from '@_modules/profile/profile.module';
import { SimulationModule } from '@_modules/simulation/simulation.module';
import { UserModule } from '@_modules/user/user.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule as NestScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from 'schedulers/quote/schedule.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 글로벌로 환경 변수 사용
      envFilePath: process.env.NODE_ENV === 'production' ? '.env.production' : '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // ConfigModule에서 환경 변수 가져오기
      inject: [ConfigService], // ConfigService 의존성 주입
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'), // localhost로 설정
        port: configService.get<number>('DB_PORT'), // 3307로 설정
        username: configService.get<string>('DB_USER'), // RDS 사용자명
        password: configService.get<string>('DB_PASSWORD'), // RDS 비밀번호
        database: configService.get<string>('DB_NAME'), // DB 이름
        entities: [__dirname + '/**/*.entity{.ts,.js}'], // 엔티티 경로 설정
        synchronize: true, // 개발 환경에서만 true, 배포 환경에서는 false로 설정
        connectTimeout: 60000, // 타임아웃 설정
        extra: {}, // SSL 제외, 추가 설정 없음
        logging: true, // 모든 쿼리 로그 활성화
      }),
    }),
    AuthModule,
    FileUploadModule,
    LifeGraphModule,
    ProfileModule,
    UserModule,
    SimulationModule,
    ExpertModule,
    CommunityModule,
    ScheduleModule,
    NestScheduleModule.forRoot(),
  ],
})
export class AppModule {}
