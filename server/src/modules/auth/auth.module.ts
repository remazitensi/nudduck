/**
 * File Name    : auth.module.ts
 * Description  : auth 모듈 로직
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.07    이승철      Created
 * 2024.09.08    이승철      Modified    구글, 카카오, jwt 전략 추가 및 컨트롤러 설정
 */

import { AuthController } from '@_auth/auth.controller';
import { AuthRepository } from '@_auth/auth.repository';
import { AuthService } from '@_auth/auth.service';
import { GoogleStrategy } from '@_auth/strategies/google.strategy';
import { JwtStrategy } from '@_auth/strategies/jwt.strategy';
import { User } from '@_user/entity/user.entity';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KakaoStrategy } from './strategies/kakao.strategy';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_ACCESS_SECRET'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, GoogleStrategy, KakaoStrategy, JwtStrategy],
  exports: [AuthService, JwtStrategy, PassportModule],
})
export class AuthModule {}
