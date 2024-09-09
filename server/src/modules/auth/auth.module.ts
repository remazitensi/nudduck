/**
 * File Name    : auth.module.ts
 * Description  : auth 모듈 로직
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.07    이승철      Created
 * 2024.09.08    이승철      Modified    구글, 카카오, jwt 전략 추가 및 컨트롤러 설정
 * 2024.09.10    이승철      Modified    UserModule 추가 및 forRoot 전역설정 삭제
 */

import { AuthController } from '@_auth/auth.controller';
import { AuthRepository } from '@_auth/auth.repository';
import { AuthService } from '@_auth/auth.service';
import { GoogleStrategy } from '@_auth/strategies/google.strategy';
import { JwtStrategy } from '@_auth/strategies/jwt.strategy';
import { UserModule } from '@_user/user.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { KakaoStrategy } from './strategies/kakao.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_ACCESS_SECRET'),
      }),
      inject: [ConfigService],
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, GoogleStrategy, KakaoStrategy, JwtStrategy],
  exports: [AuthService, JwtStrategy, PassportModule],
})
export class AuthModule {}
