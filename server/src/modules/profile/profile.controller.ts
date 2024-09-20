/**
 * File Name    : profile.controller.ts
 * Description  : profile 컨트롤러 로직
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.17    이승철      Created
 * 2024.09.19    이승철      Modified    ApiResponse 추가
 * 2024.09.21    이승철      Modified    swagger 데코레이터 재정렬
 * 2024.09.21    이승철      Modified    절대경로 변경
 */

import { Jwt } from '@_modules/auth/guards/jwt';
import { ProfileService } from '@_modules/profile/profile.service';
import { ProfileDto } from '@_modules/user/dto/profile.dto';
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Profile Management')
@Controller('profile')
@UseGuards(Jwt)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @ApiOperation({ summary: '다른 유저의 프로필 조회' })
  @ApiParam({ name: 'userId', description: '조회할 유저의 ID', example: 1 })
  @ApiResponse({ status: 200, description: '성공적으로 유저 프로필을 반환합니다.', type: ProfileDto })
  @ApiResponse({ status: 404, description: '유저를 찾을 수 없습니다.' })
  @Get(':userId')
  async getUserProfile(@Param('userId') userId: number): Promise<ProfileDto> {
    return this.profileService.getUserProfile(userId);
  }
}
