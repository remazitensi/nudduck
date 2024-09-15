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
 * 2024.09.10    이승철      Modified    accessToken 재발급 api 삭제, 만료시 클라이언트에서 재로그인 유도
 * 2024.09.10    이승철      Modified    userDto 구조분해할당
 * 2024.09.10    이승철      Modified    accessToken 재발급 api 재추가
 * 2024.09.16    이승철      Modified    controller에서 쿠키 응답, 절대경로 변경
 */

import { AuthService } from '@_modules/auth/auth.service';
import { RefreshTokenDto } from '@_modules/auth/dto/refresh-token.dto';
import { UserDto } from '@_modules/auth/dto/user.dto';
import { OAuthUser } from '@_modules/auth/utils/oauth-user.interface';
import { BadRequestException, Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { getAccessCookieOptions, getRefreshCookieOptions } from '@_modules/auth/utils/cookie-helper';

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
    const { provider, providerId, email, name } = req.user;

    const userDto: UserDto = {
      provider,
      providerId,
      email,
      name,
    };

    const tokens = await this.authService.getSocialLogin(userDto);
    
    res.cookie('accessToken', tokens.accessToken, getAccessCookieOptions());
    res.cookie('refreshToken', tokens.refreshToken, getRefreshCookieOptions());
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
    const { provider, providerId, email, name } = req.user;

    const userDto: UserDto = {
      provider,
      providerId,
      email,
      name,
    };

    const tokens = await this.authService.getSocialLogin(userDto);
    
    res.cookie('accessToken', tokens.accessToken, getAccessCookieOptions());
    res.cookie('refreshToken', tokens.refreshToken, getRefreshCookieOptions());
    res.status(200).send('Login successful'); // 성공 응답을 주고 클라이언트에서 redirect
  }

  @ApiOperation({ summary: '엑세스 토큰 재발급' })
  @Post('access-token')
  async accessToken(@Body() refreshTokenDto: RefreshTokenDto, @Res() res: Response): Promise<void> {
    if (!refreshTokenDto.refreshToken) {
      throw new BadRequestException('리프레시 토큰이 제공되지 않았습니다.');
    }

    const newAccessToken = await this.authService.regenerateAccessToken(refreshTokenDto.refreshToken);
    
    res.cookie('accessToken', newAccessToken, getAccessCookieOptions());
    res.status(200).json({ message: '엑세스 토큰이 재발급되었습니다.' });
  }
}
