/**
 * File Name    : google.strategy.ts
 * Description  : 구글 소셜로그인 전략
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.07    이승철      Created
 * 2024.09.07    이승철      Modified    구글 전략 추가
 * 2024.09.10    이승철      Modified    user 객체 반환
 * 2024.09.16    이승철      Modified    절대경로 변경
 * 2024.09.17    이승철      Modified    OAuthUser interface 디렉토리로 변경
 */

import { OAuthUser } from 'common/interfaces/oauth-user.interface';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile): Promise<OAuthUser> {
    const { id, name, emails } = profile;
    const fullName = name.familyName ? `${name.familyName}${name.givenName} ` : name.givenName;
    const user = {
      provider: 'google',
      providerId: id,
      email: emails[0].value,
      name: fullName,
    };

    return user;
  }
}
