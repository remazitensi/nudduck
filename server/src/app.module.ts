import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'modules/auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost', // MySQL 서버의 호스트
      port: 3306, // MySQL 서버 포트
      username: 'Lsiron', // MySQL 사용자 이름
      password: '971209', // MySQL 사용자 비밀번호
      database: 'nudduck', // MySQL 데이터베이스 이름
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // 사용할 엔티티 목록
      synchronize: true, // 자동으로 테이블을 동기화 (개발 환경에서만 사용 권장)
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
