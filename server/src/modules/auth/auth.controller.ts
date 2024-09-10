/**
 * File Name    : auth.controller.ts
 * Description  : auth 컨트롤러 로직
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.07    이승철      Created
 * 2024.09.07    이승철      Modified    구글, 카카오, 토큰재발급 api 추가
 * 2024.09.08    이승철      Modified    예외처리
 * 2024.09.09    이승철      Modified    로그인 성공 시 응답만 전달, 클라이언트에서 redirect
 * 2024.09.09    이승철      Modified    configService 삭제
 * 2024.09.10    이승철      Modified    refreshToken 재발급 api 삭제, 만료시 클라이언트에서 재로그인 유도
 */

import { AuthService } from '@_auth/auth.service';
import { UserDto } from '@_auth/dto/user.dto';
import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { OAuthUser } from './interface/oauth-user.interface';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: '구글 소셜 로그인' })
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @ApiOperation({ summary: '구글 로그인 콜백' })
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: { user: OAuthUser }, @Res() res: Response): Promise<void> {
    const userDto: UserDto = {
      provider: 'google',
      providerId: req.user.providerId,
      email: req.user.email,
      name: req.user.name,
    };

    await this.authService.socialLogin(userDto, res);
    res.status(200).send('Login successful'); // 성공 응답을 주고 클라이언트에서 redirect
  }

  @ApiOperation({ summary: '카카오 로그인' })
  @Get('kakao')
  @UseGuards(AuthGuard('kakao'))
  async kakaoAuth() {}

  @ApiOperation({ summary: '카카오 로그인 콜백' })
  @Get('kakao/callback')
  @UseGuards(AuthGuard('kakao'))
  async kakaoAuthCallback(@Req() req: { user: OAuthUser }, @Res() res: Response): Promise<void> {
    const userDto: UserDto = {
      provider: 'kakao',
      providerId: req.user.providerId,
      email: req.user.email,
      name: req.user.name,
    };

    await this.authService.socialLogin(userDto, res);
    res.status(200).send('Login successful'); // 성공 응답을 주고 클라이언트에서 redirect
  }
}
