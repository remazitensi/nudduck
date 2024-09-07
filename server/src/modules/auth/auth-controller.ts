import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  @ApiOperation({ summary: '구글 소셜 로그인' })
  @Get('google')
  googleLogin() {
    return { message: '구글 로그인' };
  }

  @ApiOperation({ summary: '구글 로그인 콜백' })
  @Get('google/callback')
  googleCallback() {
    return { message: '구글 로그인 완료' };
  }

  @ApiOperation({ summary: '카카오 소셜 로그인' })
  @Get('kakao')
  kakaoLogin() {
    return { message: '카카오 로그인' };
  }

  @ApiOperation({ summary: '카카오 로그인 콜백' })
  @Get('kakao/callback')
  kakaoCallback() {
    return { message: '카카오 로그인 완료' };
  }

  @ApiOperation({ summary: '토큰 재발급' })
  @Post('refresh-token')
  refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return { message: '토큰 재발급', token: refreshTokenDto.refreshToken };
  }
}
