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
 */

import { AuthModule } from '@_auth/auth.module';
import { FileUploadModule } from '@_file-upload/file-upload.module';
import { UserModule } from '@_user/user.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';
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
      async dataSourceFactory(option) {
        if (!option) throw new Error('Invalid options passed');

        return addTransactionalDataSource(new DataSource(option));
      },
    }),
    AuthModule,
    UserModule,
    FileUploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
