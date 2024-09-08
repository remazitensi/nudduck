/**
 * File Name    : auth.service.ts
 * Description  : auth 서비스 로직
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.07    이승철      Created
 * 2024.09.07    이승철      Modified    구글, 카카오 로그인 및 인가처리
 * 2024.09.08    이승철      Modified    예외처리 및 리팩토링
 */

import { AuthRepository } from '@_auth/auth.repository';
import { UserDto } from '@_auth/dto/user.dto';
import { User } from '@_user/entity/user.entity';
import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // 구글/카카오 로그인 처리
  async socialLogin(userDto: UserDto, res: Response): Promise<void> {
    const existingUser = await this.authRepository.findUserByProvider(userDto.provider, userDto.providerId);

    // 유저가 있으면 기존 유저, 없으면 새로운 유저 생성
    const user = existingUser || (await this.createNewUser(userDto));

    // 토큰 생성 및 리프레시 토큰 저장
    const tokens = this.generateTokens(user);
    await this.authRepository.updateRefreshToken(user.id, tokens.refreshToken);

    // AccessToken, RefreshToken을 쿠키에 저장
    this.setCookies(res, tokens);
  }

  // 신규 사용자 생성
  private async createNewUser(userDto: UserDto): Promise<User> {
    return await this.authRepository.createUser(userDto);
  }

  // 사용자 ID로 조회
  async findUserById(id: number): Promise<User> {
    const user = await this.authRepository.findUserById(id);
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }
    return user;
  }

  // 토큰 생성
  private generateTokens(user: User): { accessToken: string; refreshToken: string } {
    const payload = { sub: user.id, provider: user.provider, email: user.email };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_SECRET'),
      expiresIn: '1h',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  // 쿠키 설정
  private setCookies(res: Response, tokens: { accessToken: string; refreshToken: string }): void {
    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 1000, // 1시간
    });
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
    });
  }

  // 리프레시 토큰 검증 및 AccessToken 재발급
  async regenerateAccessToken(refreshToken: string): Promise<{ accessToken: string }> {
    const payload = this.jwtService.verify(refreshToken, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
    });

    const user = await this.authRepository.findUserByProvider(payload.provider, payload.sub);
    if (!user) {
      throw new UnauthorizedException('사용자를 찾을 수 없습니다.');
    }

    if (user.refreshToken !== refreshToken) {
      throw new ForbiddenException('리프레시 토큰이 일치하지 않습니다.');
    }

    const accessToken = this.jwtService.sign(
      { sub: user.id, provider: user.provider, email: user.email },
      {
        secret: this.configService.get('JWT_ACCESS_SECRET'),
        expiresIn: '1h',
      },
    );

    return { accessToken };
  }
}
