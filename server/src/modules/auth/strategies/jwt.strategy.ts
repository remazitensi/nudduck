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
 * 2024.09.16    이승철      Modified    절대경로 변경
 * 2024.09.29    이승철      Modified    토큰 이름 변경
 */

import { AuthRepository } from '@_modules/auth/auth.repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { UserRequest } from 'common/interfaces/user-request.interface';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authRepository: AuthRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: UserRequest) => {
          const token = request?.cookies?._a;
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
