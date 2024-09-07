/**
 * File Name    : jwt.strategy.ts
 * Description  : jwt 전략
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.07    이승철      Created
 * 2024.09.07    이승철      Modified    jwt 전략 추가
 */

import { AuthService } from '@_auth/auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_ACCESS_SECRET'),
    });
  }

  async validate(payload: { sub: string; provider: string }): Promise<{ id: number }> {
    const user = await this.authService.findUserByProvider(payload.provider, payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    return { id: user.id };
  }
}
