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
 * 2024.09.10    이승철      Modified    FileUploadModule 추가
 * 2024.09.16    이승철      Modified    절대경로 변경
 * 2024.09.23    김재영      Modified
 */

import { AuthController } from '@_modules/auth/auth.controller';
import { AuthRepository } from '@_modules/auth/auth.repository';
import { AuthService } from '@_modules/auth/auth.service';
import { GoogleStrategy } from '@_modules/auth/strategies/google.strategy';
import { JwtStrategy } from '@_modules/auth/strategies/jwt.strategy';
import { FileUploadModule } from '@_modules/file-upload/file-upload.module';
import { UserModule } from '@_modules/user/user.module';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { KakaoStrategy } from './strategies/kakao.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';

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
    FileUploadModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, GoogleStrategy, KakaoStrategy, JwtStrategy, JwtService],
  exports: [AuthService, JwtStrategy, PassportModule, JwtService],
})
export class AuthModule {}
