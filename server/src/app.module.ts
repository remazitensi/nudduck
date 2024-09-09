/**
 * File Name    : app.module.ts
 * Description  : 애플리케이션 모듈
 * Author       : 김재영
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.06    김재영      Created     애플리케이션 모듈 초기 생성
 * 2024.09.09    김재영      Modified    커뮤니티 모듈 추가
 */

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
      isGlobal: true,
    }),
    // TypeOrmModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: (configService: ConfigService) => ({
    //     type: 'mysql',
    //     host: configService.get<string>('DB_HOST'),
    //     port: configService.get<number>('DB_PORT'),
    //     username: configService.get<string>('DB_USER'),
    //     password: configService.get<string>('DB_PASSWORD'),
    //     database: configService.get<string>('DB_NAME'),
    //     entities: [__dirname + '/**/*.entity{.ts,.js}'],
    //     synchronize: true,
    //   }),
    // }),
    CommunityModule,
  ],
  controllers: [AppController, IntroController, UserController, SimulationController, ChatController, ExpertController, LifeGraphController],
  providers: [AppService],
})
export class AppModule {}
