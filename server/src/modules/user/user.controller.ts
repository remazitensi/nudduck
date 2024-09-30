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
 * 2024.09.21    이승철      Modified    swagger 데코레이터 재정렬
 * 2024.09.23    이승철      Modified    MyProfileDto로 변경
 * 2024.09.24    이승철      Modified    프로필 조회 나의 게시글 포함
 * 2024.09.30    이승철      Modified    로그인 한 유저 정보 조회 api 추가
 * 2024.09.30    이승철      Modified    토큰 이름 변경
 */

import { Jwt } from '@_modules/auth/guards/jwt';
import { MyInfoDto } from '@_modules/user/dto/my-info.dto';
import { MyPaginationQueryDto } from '@_modules/user/dto/my-pagination-query.dto';
import { MyProfileDto } from '@_modules/user/dto/my-profile.dto';
import { UpdateMyProfileDto } from '@_modules/user/dto/update-my-profile.dto';
import { UserService } from '@_modules/user/user.service';
import { Body, Controller, Delete, Get, Post, Put, Query, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserRequest } from 'common/interfaces/user-request.interface';
import { Response } from 'express';

@ApiTags('User Management')
@Controller('my')
@UseGuards(Jwt)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '프로필 조회 및 게시글 목록 조회' })
  @ApiResponse({ status: 200, description: '유저 프로필 조회 성공', type: MyProfileDto })
  @ApiResponse({ status: 404, description: '유저를 찾을 수 없습니다.' })
  @Get()
  async getMyProfile(@Req() req: UserRequest, @Query() myPaginationQueryDto: MyPaginationQueryDto): Promise<MyProfileDto> {
    return this.userService.getMyProfileWithPosts(req.user.id, myPaginationQueryDto);
  }

  @ApiOperation({ summary: '로그인한 유저 정보 조회' })
  @ApiResponse({ status: 200, description: '유저 정보 조회 성공' })
  @ApiResponse({ status: 404, description: '유저를 찾을 수 없습니다.' })
  @Get('info')
  async getUserInfo(@Req() req: UserRequest): Promise<MyInfoDto> {
    return this.userService.getMyInfoById(req.user.id);
  }

  @ApiOperation({ summary: '회원정보 수정' })
  @ApiBody({ description: '회원 정보 수정에 필요한 데이터', type: UpdateMyProfileDto })
  @ApiResponse({ status: 200, description: '회원정보가 수정되었습니다.' })
  @ApiResponse({ status: 404, description: '유저를 찾을 수 없습니다.' })
  @Put('profile')
  async updateProfile(@Req() req: UserRequest, @Body() updateMyProfileDto: UpdateMyProfileDto): Promise<{ message: string }> {
    await this.userService.updateMyProfile(req.user.id, updateMyProfileDto);
    return { message: '회원정보가 수정되었습니다.' };
  }

  @ApiOperation({ summary: '로그아웃' })
  @ApiResponse({ status: 200, description: '로그아웃 되었습니다.' })
  @ApiResponse({ status: 404, description: '유저를 찾을 수 없습니다.' })
  @Post('logout')
  async logout(@Req() req: UserRequest, @Res() res: Response): Promise<void> {
    await this.userService.logout(req.user.id);
    res.clearCookie('_a');
    res.clearCookie('__r');
    res.status(200).json({ message: '로그아웃 되었습니다.' });
  }

  @ApiOperation({ summary: '계정 탈퇴' })
  @ApiResponse({ status: 200, description: '회원탈퇴가 완료되었습니다.' })
  @ApiResponse({ status: 404, description: '유저를 찾을 수 없습니다.' })
  @Delete('account')
  async deleteAccount(@Req() req: UserRequest, @Res() res: Response): Promise<void> {
    await this.userService.deleteUser(req.user.id);
    res.clearCookie('_a');
    res.clearCookie('__r');
    res.status(200).json({ message: '회원탈퇴가 완료되었습니다.' });
  }
}
