import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Intro')
@Controller()
export class IntroController {
  @ApiOperation({ summary: '서비스 소개 페이지' })
  @Get('/')
  getIntro() {
    return { message: '서비스 소개 페이지' };
  }

  @ApiOperation({ summary: '메인 페이지' })
  @Get('/home')
  getHome() {
    return { message: '메인 페이지' };
  }
}
