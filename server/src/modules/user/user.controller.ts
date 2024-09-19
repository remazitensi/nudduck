/**
 * File Name    : user.controller.ts
 * Description  : user 컨트롤러 로직
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.10    이승철      Created
 * 2024.09.16    이승철      Modified    절대경로 변경, 컨트롤러에서 쿠키삭제 로직
 * 2024.09.17    이승철      Modified    request 객체에 user 타입 확장
 * 2024.09.19    이승철      Modified    ApiResponse 추가
 */

import { Jwt } from '@_modules/auth/guards/jwt';
import { ProfileDto } from '@_modules/user/dto/profile.dto';
import { UpdateProfileDto } from '@_modules/user/dto/update-profile.dto';
import { UserService } from '@_modules/user/user.service';
import { Body, Controller, Delete, Get, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserRequest } from 'common/interfaces/user-request.interface';
import { Response } from 'express';

@ApiTags('User Management')
@Controller('my')
@UseGuards(Jwt)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '프로필 조회' })
  @ApiResponse({
    status: 200,
    description: '유저 프로필 조회 성공',
    type: ProfileDto,
  })
  @ApiResponse({
    status: 404,
    description: '유저를 찾을 수 없습니다.',
  })
  @Get()
  async getMyProfile(@Req() req: UserRequest): Promise<ProfileDto> {
    return this.userService.getMyProfile(req.user.id);
  }

  @ApiOperation({ summary: '회원정보 수정' })
  @ApiBody({
    description: '회원 정보 수정에 필요한 데이터',
    type: UpdateProfileDto,
  })
  @ApiResponse({
    status: 200,
    description: '회원정보가 수정되었습니다.',
  })
  @ApiResponse({
    status: 404,
    description: '유저를 찾을 수 없습니다.',
  })
  @Put('profile')
  async updateProfile(@Req() req: UserRequest, @Body() updateProfileDto: UpdateProfileDto): Promise<{ message: string }> {
    await this.userService.updateProfile(req.user.id, updateProfileDto);
    return { message: '회원정보가 수정되었습니다.' };
  }

  @ApiOperation({ summary: '로그아웃' })
  @ApiResponse({
    status: 200,
    description: '로그아웃 되었습니다.',
  })
  @ApiResponse({
    status: 404,
    description: '유저를 찾을 수 없습니다.',
  })
  @Post('logout')
  async logout(@Req() req: UserRequest, @Res() res: Response): Promise<void> {
    await this.userService.logout(req.user.id);
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.status(200).json({ message: '로그아웃 되었습니다.' });
  }

  @ApiOperation({ summary: '계정 탈퇴' })
  @ApiResponse({
    status: 200,
    description: '회원탈퇴가 완료되었습니다.',
  })
  @ApiResponse({
    status: 404,
    description: '유저를 찾을 수 없습니다.',
  })
  @Delete('account')
  async deleteAccount(@Req() req: UserRequest, @Res() res: Response): Promise<void> {
    await this.userService.deleteUser(req.user.id);
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.status(200).json({ message: '회원탈퇴가 완료되었습니다.' });
  }
}
