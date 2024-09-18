/**
 * File Name    : profile.controller.ts
 * Description  : profile 컨트롤러 로직
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.17    이승철      Created
 */

import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProfileDto } from '@_modules/user/dto/profile.dto';
import { Jwt } from '@_modules/auth/guards/jwt';

@ApiTags('Profile Management')
@Controller('profile')
@UseGuards(Jwt)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @ApiOperation({ summary: '다른 유저의 프로필 조회' })
  @ApiResponse({
    type: ProfileDto,
  })
  @Get(':userId')
  async getUserProfile(@Param('userId') userId: number): Promise<ProfileDto> {
    return this.profileService.getUserProfile(userId);
  }
}
