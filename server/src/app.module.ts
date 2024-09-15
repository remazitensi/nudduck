/**
 * File Name    : app.module.ts
 * Description  : app 모듈
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.07    김재영      Created
 * 2024.09.07    이승철      Modified    db설정 및, 엔티티 경로 설정
 * 2024.09.10    이승철      Modified    FileUpload, User Module 추가, 트랜잭션 DataSource 추가
 * 2024.09.16    이승철      Modified    트랜잭션 DataSource 삭제, 절대경로 변경
 */

import { AuthModule } from '@_modules/auth/auth.module';
import { FileUploadModule } from '@_modules/file-upload/file-upload.module';
import { UserModule } from '@_modules/user/user.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        autoLoadEntities: true,
        keepConnectionAlive: true,
        synchronize: true,
      }),
    }),
    AuthModule,
    UserModule,
    FileUploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
