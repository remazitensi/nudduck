/**
 * File Name    : user.controller.ts
 * Description  : user controller 테스트
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.16    이승철      Created
 * 2024.09.18    이승철      Modified    Partial로 req 객체 모킹
 */

import { ProfileDto } from '@_modules/user/dto/profile.dto';
import { UpdateProfileDto } from '@_modules/user/dto/update-profile.dto';
import { UserController } from '@_modules/user/user.controller';
import { UserService } from '@_modules/user/user.service';
import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { UserRequest } from 'common/interfaces/user-request.interface';

describe('UserController', () => {
  let userController: UserController;
  let mockUserService: Partial<UserService>;

  beforeEach(async () => {
    mockUserService = {
      getMyProfile: jest.fn(),
      updateProfile: jest.fn(),
      logout: jest.fn(),
      deleteUser: jest.fn(),
    };

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
  });

  describe('getMyProfile', () => {
    it('should return a profile', async () => {
      const mockProfile: ProfileDto = {
        nickname: 'tUser',
        email: 'test@example.com',
        name: 'Test User',
        imageUrl: 'http://example.com/test.jpg',
        hashtags: ['developer', 'blogger'],
      };

      mockUserService.getMyProfile = jest.fn().mockResolvedValue(mockProfile);

      const req = { user: { id: 1 } } as Partial<UserRequest>;  
      const result = await userController.getMyProfile(req as UserRequest);

      expect(result).toEqual(mockProfile);
      expect(mockUserService.getMyProfile).toHaveBeenCalledWith(1);
    });
  });

  describe('updateProfile', () => {
    it('should update user profile', async () => {
      const mockUpdateProfileDto: UpdateProfileDto = {
        nickname: 'newNic',
        imageUrl: 'http://example.com/new.jpg',
        hashtags: ['newTag'],
      };
      const req = { user: { id: 1 } } as Partial<UserRequest>;

      mockUserService.updateProfile = jest.fn().mockResolvedValue(undefined);

      const result = await userController.updateProfile(req as UserRequest, mockUpdateProfileDto);

      expect(result).toEqual({ message: '회원정보가 수정되었습니다.' });
      expect(mockUserService.updateProfile).toHaveBeenCalledWith(1, mockUpdateProfileDto);
    });
  });

  describe('logout', () => {
    it('should log out the user', async () => {
      const req = { user: { id: 1 } } as Partial<UserRequest>;  
      const res: Partial<Response> = {  
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        clearCookie: jest.fn(),
      };

      mockUserService.logout = jest.fn().mockResolvedValue(undefined);

      await userController.logout(req as UserRequest, res as Response);

      expect(mockUserService.logout).toHaveBeenCalledWith(1);
      expect(res.clearCookie).toHaveBeenCalledWith('accessToken');
      expect(res.clearCookie).toHaveBeenCalledWith('refreshToken');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: '로그아웃 되었습니다.' });
    });
  });

  describe('deleteAccount', () => {
    it('should delete the user account', async () => {
      const req = { user: { id: 1 } } as Partial<UserRequest>;  
      const res: Partial<Response> = {  
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        clearCookie: jest.fn(),
      };

      mockUserService.deleteUser = jest.fn().mockResolvedValue(undefined);

      await userController.deleteAccount(req as UserRequest, res as Response);

      expect(mockUserService.deleteUser).toHaveBeenCalledWith(1);
      expect(res.clearCookie).toHaveBeenCalledWith('accessToken');
      expect(res.clearCookie).toHaveBeenCalledWith('refreshToken');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: '회원탈퇴가 완료되었습니다.' });
    });
  });
});
