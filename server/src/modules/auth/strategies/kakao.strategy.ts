/**
 * File Name    : kakao.strategy.ts
 * Description  : 카카오 소셜로그인 전략
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.08    이승철      Created
 * 2024.09.08    이승철      Modified    카카오 전략 추가
 * 2024.09.10    이승철      Modified    user 객체 반환
 */

import { OAuthUser } from '@_auth/interface/oauth-user.interface';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-kakao';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get<string>('KAKAO_CLIENT_ID'),
      clientSecret: configService.get<string>('KAKAO_CLIENT_SECRET'),
      callbackURL: configService.get<string>('KAKAO_CALLBACK_URL'),
      scope: ['account_email', 'profile_nickname'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile): Promise<OAuthUser> {
    const user = {
      provider: 'kakao',
      providerId: profile.id,
      email: profile._json.kakao_account.email,
      name: profile.displayName,
    };
    return user;
  }
}
