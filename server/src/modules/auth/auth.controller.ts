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
 */

import { AuthService } from '@_auth/auth.service';
import { RefreshTokenDto } from '@_auth/dto/refresh-token.dto';
import { UserDto } from '@_auth/dto/user.dto';
import { BadRequestException, Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { OAuthUser } from './interface/oauth-user.interface';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @ApiOperation({ summary: '구글 소셜 로그인' })
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @ApiOperation({ summary: '구글 로그인 콜백' })
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: { user: OAuthUser }, @Res() res): Promise<void> {
    const userDto: UserDto = {
      provider: 'google',
      providerId: req.user.providerId,
      email: req.user.email,
      name: req.user.name,
    };

    await this.authService.socialLogin(userDto, res);
    const clientUrl = this.configService.get<string>('CLIENT_URL');
    res.redirect(clientUrl);
  }

  @ApiOperation({ summary: '카카오 로그인' })
  @Get('kakao')
  @UseGuards(AuthGuard('kakao'))
  async kakaoAuth() {}

  @ApiOperation({ summary: '카카오 로그인 콜백' })
  @Get('kakao/callback')
  @UseGuards(AuthGuard('kakao'))
  async kakaoAuthCallback(@Req() req: { user: OAuthUser }, @Res() res): Promise<void> {
    const userDto: UserDto = {
      provider: 'kakao',
      providerId: req.user.providerId,
      email: req.user.email,
      name: req.user.name,
    };

    await this.authService.socialLogin(userDto, res);
    const clientUrl = this.configService.get<string>('CLIENT_URL');
    res.redirect(clientUrl);
  }

  @ApiOperation({ summary: '토큰 재발급' })
  @Post('refresh-token')
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    if (!refreshTokenDto.refreshToken) {
      throw new BadRequestException('리프레시 토큰이 제공되지 않았습니다.');
    }
    const accessToken = await this.authService.regenerateAccessToken(refreshTokenDto.refreshToken);
    return { accessToken };
  }
}
