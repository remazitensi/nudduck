/**
 * File Name    : user.controller.ts
 * Description  : user 컨트롤러 로직
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.10    이승철      Created
 */

import { Jwt } from '@_auth/guards/jwt';
import { ProfileDto } from '@_user/dto/profile.dto';
import { UpdateProfileDto } from '@_user/dto/update-profile.dto';
import { UserService } from '@_user/user.service';
import { Body, Controller, Delete, Get, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('User Management')
@Controller('my')
@UseGuards(Jwt)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '프로필 조회' })
  @ApiResponse({
    type: ProfileDto,
  })
  @Get()
  async getProfile(@Req() req): Promise<ProfileDto> {
    return this.userService.getProfile(req.user.id);
  }

  @ApiOperation({ summary: '회원정보 수정' })
  @Put('profile')
  async updateProfile(@Req() req, @Body() updateProfileDto: UpdateProfileDto): Promise<{ message: string }> {
    await this.userService.updateProfile(req.user.id, updateProfileDto);
    return { message: '회원정보가 수정되었습니다.' };
  }

  @ApiOperation({ summary: '로그아웃' })
  @Post('logout')
  async logout(@Req() req, @Res() res: Response): Promise<void> {
    await this.userService.logout(req.user.id, res);
    res.status(200).json({ message: '로그아웃 되었습니다.' });
  }

  @ApiOperation({ summary: '계정 탈퇴' })
  @Delete('account')
  async deleteAccount(@Req() req, @Res() res: Response): Promise<void> {
    await this.userService.deleteUser(req.user.id, res);
    res.status(200).json({ message: '회원탈퇴가 완료되었습니다.' });
  }
}
