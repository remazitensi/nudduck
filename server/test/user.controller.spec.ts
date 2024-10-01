/**
 * File Name    : user.controller.ts
 * Description  : user controller 테스트
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.16    이승철      Created
 * 2024.09.18    이승철      Modified    Partial로 req 객체 모킹
 * 2024.09.30    이승철      Modified    내 정보 조회 api 추가 및 토큰 이름 변경
 */

import { MyInfoDto } from '@_modules/user/dto/my-info.dto';
import { MyPaginationQueryDto } from '@_modules/user/dto/my-pagination-query.dto';
import { MyProfileDto } from '@_modules/user/dto/my-profile.dto';
import { UpdateMyProfileDto } from '@_modules/user/dto/update-my-profile.dto';
import { UserController } from '@_modules/user/user.controller';
import { UserService } from '@_modules/user/user.service';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserRequest } from 'common/interfaces/user-request.interface';
import { Response } from 'express';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  const mockUserService = {
    getMyProfileWithPosts: jest.fn(),
    getMyInfoById: jest.fn(),
    updateMyProfile: jest.fn(),
    logout: jest.fn(),
    deleteUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  describe('getMyProfile', () => {
    it('should return the profile of the logged-in user', async () => {
      const mockProfile: MyProfileDto = {
        nickname: 'JohnDoe123',
        email: 'john.doe@example.com',
        name: 'John Doe',
        imageUrl: 'https://example.com/profile-image.jpg',
        hashtags: ['Developer', 'Blogger'],
        favoriteLifeGraph: null,
        posts: [],
        totalCount: 10,
        createdAt: new Date(),
      };

      mockUserService.getMyProfileWithPosts.mockResolvedValue(mockProfile);

      const req = { user: { id: 1 } };
      const query: MyPaginationQueryDto = { page: 1, limit: 10 };
      const result = await userController.getMyProfile(req as UserRequest, query);

      expect(userService.getMyProfileWithPosts).toHaveBeenCalledWith(req.user.id, query);
      expect(result).toEqual(mockProfile);
    });
  });

  describe('getUserInfo', () => {
    it('should return the logged-in user info', async () => {
      const mockInfo: MyInfoDto = {
        id: 1,
        nickname: 'JohnDoe',
        email: 'john.doe@example.com',
        imageUrl: 'https://example.com/profile.jpg',
        name: 'John Doe',
      };

      mockUserService.getMyInfoById.mockResolvedValue(mockInfo);

      const req = { user: { id: 1 } };
      const result = await userController.getUserInfo(req as UserRequest);

      expect(userService.getMyInfoById).toHaveBeenCalledWith(req.user.id);
      expect(result).toEqual(mockInfo);
    });

    it('should throw a NotFoundException when the user is not found', async () => {
      mockUserService.getMyInfoById.mockRejectedValue(new NotFoundException('User not found'));

      const req = { user: { id: 1 } };

      await expect(userController.getUserInfo(req as UserRequest)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateProfile', () => {
    it('should update the profile of the logged-in user', async () => {
      const mockUpdateDto: UpdateMyProfileDto = {
        nickname: 'newNickName',
        imageUrl: 'https://example.com/new-image.jpg',
        hashtags: ['#devel'],
      };

      const req = { user: { id: 1 } };

      const result = await userController.updateProfile(req as UserRequest, mockUpdateDto);

      expect(userService.updateMyProfile).toHaveBeenCalledWith(req.user.id, mockUpdateDto);
      expect(result).toEqual({ message: '회원정보가 수정되었습니다.' });
    });
  });

  describe('logout', () => {
    it('should log out the user', async () => {
      const req = { user: { id: 1 } };
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        clearCookie: jest.fn(),
      };

      await userController.logout(req as UserRequest, res as Response);

      expect(mockUserService.logout).toHaveBeenCalledWith(1);
      expect(res.clearCookie).toHaveBeenCalledWith('_a');
      expect(res.clearCookie).toHaveBeenCalledWith('__r');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: '로그아웃 되었습니다.' });
    });
  });

  describe('deleteAccount', () => {
    it('should delete the user account', async () => {
      const req = { user: { id: 1 } };
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        clearCookie: jest.fn(),
      };

      await userController.deleteAccount(req as UserRequest, res as Response);

      expect(mockUserService.deleteUser).toHaveBeenCalledWith(1);
      expect(res.clearCookie).toHaveBeenCalledWith('_a');
      expect(res.clearCookie).toHaveBeenCalledWith('__r');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: '회원탈퇴가 완료되었습니다.' });
    });
  });
});
