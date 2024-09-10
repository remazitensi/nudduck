/**
 * File Name    : jwt.strategy.ts
 * Description  : jwt 전략
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.07    이승철      Created
 * 2024.09.07    이승철      Modified    jwt 전략 추가
 * 2024.09.08    이승철      Modified    메서드 중복 제거로 인한 authService => authRepository
 * 2024.09.11    이승철      Modified    쿠키에서 accessToken 추출 로직
 */

import { AuthRepository } from '@_auth/auth.repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authRepository: AuthRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const token = request?.cookies?.accessToken;
          if (!token) {
            return null;
          }
          return token;
        },
      ]),
      secretOrKey: configService.get<string>('JWT_ACCESS_SECRET'),
      ignoreExpiration: false,
    });
  }

  async validate(payload: { sub: string; provider: string }): Promise<{ id: number }> {
    const user = await this.authRepository.findUserByProvider(payload.provider, payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    return { id: user.id };
  }
}
