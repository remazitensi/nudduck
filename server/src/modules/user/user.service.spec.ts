import { FileUploadService } from '@_file-upload/file-upload.service';
import { User } from '@_user/entity/user.entity';
import { UserRepository } from '@_user/user.repository';
import { UserService } from '@_user/user.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: UserRepository;
  let fileUploadService: FileUploadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: {
            findUserById: jest.fn(),
            findHashtagsByUserId: jest.fn(),
            updateUser: jest.fn(),
            findUserByNickname: jest.fn(),
            removeHashtags: jest.fn(),
            saveHashtags: jest.fn(),
            softDeleteUser: jest.fn(),
          },
        },
        {
          provide: FileUploadService,
          useValue: {
            getDefaultProfileImgURL: jest.fn().mockReturnValue('default-image-url'),
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<UserRepository>(UserRepository);
    fileUploadService = module.get<FileUploadService>(FileUploadService);
  });

  describe('getProfile', () => {
    it('should return a profile', async () => {
      const mockUser: User = {
        id: 1,
        provider: 'google',
        providerId: '1234567890',
        name: 'Test User',
        email: 'test@example.com',
        nickName: 'test',
        imageUrl: 'test-url',
        refreshToken: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };
      const mockHashtags = ['developer', 'blogger'];

      jest.spyOn(userRepository, 'findUserById').mockResolvedValue(mockUser);
      jest.spyOn(userRepository, 'findHashtagsByUserId').mockResolvedValue(mockHashtags);

      const result = await userService.getProfile(1);

      expect(result).toEqual({
        nickname: 'testUser',
        email: 'test@example.com',
        name: 'Test User',
        imageUrl: 'test-url',
        hashtags: mockHashtags,
      });
      expect(userRepository.findUserById).toHaveBeenCalledWith(1);
      expect(userRepository.findHashtagsByUserId).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if user is not found', async () => {
      jest.spyOn(userRepository, 'findUserById').mockResolvedValue(null);

      await expect(userService.getProfile(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateProfile', () => {
    it('should update user profile', async () => {
      const mockUser: User = {
        id: 1,
        provider: 'google',
        providerId: '1234567890',
        name: 'Test User',
        email: 'test@example.com',
        nickName: 'test',
        imageUrl: 'old-url',
        refreshToken: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };
      const updateProfileDto = {
        nickname: 'newNic',
        imageUrl: 'new-url',
        hashtags: ['newTa'],
      };
      jest.spyOn(userRepository, 'findUserById').mockResolvedValue(mockUser);
      jest.spyOn(userRepository, 'findUserByNickname').mockResolvedValue(null);

      await userService.updateProfile(1, updateProfileDto);

      expect(userRepository.updateUser).toHaveBeenCalledWith(mockUser);
      expect(mockUser.nickName).toBe(updateProfileDto.nickname);
      expect(mockUser.imageUrl).toBe(updateProfileDto.imageUrl);
    });

    it('should throw ConflictException if nickname already exists', async () => {
      const mockUser: User = {
        id: 1,
        provider: 'google',
        providerId: '1234567890',
        name: 'Test User',
        email: 'test@example.com',
        nickName: 'test',
        imageUrl: 'old-url',
        refreshToken: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };
      const updateProfileDto = { nickname: 'newNickname', imageUrl: 'new-url' };
      const existingUser: User = {
        id: 2,
        provider: 'google',
        providerId: '0987654321',
        name: 'Existing User',
        email: 'existing@example.com',
        nickName: 'newNic',
        imageUrl: 'existing-url',
        refreshToken: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      jest.spyOn(userRepository, 'findUserById').mockResolvedValue(mockUser);
      jest.spyOn(userRepository, 'findUserByNickname').mockResolvedValue(existingUser);

      await expect(userService.updateProfile(1, updateProfileDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('logout', () => {
    it('should log out the user and clear cookies', async () => {
      const mockUser: User = {
        id: 1,
        provider: 'google',
        providerId: '1234567890',
        name: 'Test User',
        email: 'test@example.com',
        nickName: 'testU',
        imageUrl: 'test-url',
        refreshToken: 'old-token',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };
      const res = {
        clearCookie: jest.fn(),
      } as unknown as Response;

      jest.spyOn(userRepository, 'findUserById').mockResolvedValue(mockUser);
      jest.spyOn(userRepository, 'updateUser').mockResolvedValue(undefined);

      await userService.logout(1, res);

      expect(userRepository.updateUser).toHaveBeenCalledWith(mockUser);
      expect(res.clearCookie).toHaveBeenCalledWith('accessToken');
      expect(res.clearCookie).toHaveBeenCalledWith('refreshToken');
      expect(mockUser.refreshToken).toBe(null);
    });

    it('should throw NotFoundException if user is not found', async () => {
      const res = { clearCookie: jest.fn() } as unknown as Response;
      jest.spyOn(userRepository, 'findUserById').mockResolvedValue(null);

      await expect(userService.logout(1, res)).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteUser', () => {
    it('should soft delete the user and clear cookies', async () => {
      const mockUser: User = {
        id: 1,
        provider: 'google',
        providerId: '1234567890',
        name: 'Test User',
        email: 'test@example.com',
        nickName: 'testr',
        imageUrl: 'test-url',
        refreshToken: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };
      const res = {
        clearCookie: jest.fn(),
      } as unknown as Response;

      jest.spyOn(userRepository, 'findUserById').mockResolvedValue(mockUser);
      jest.spyOn(userRepository, 'softDeleteUser').mockResolvedValue(undefined);

      await userService.deleteUser(1, res);

      expect(userRepository.softDeleteUser).toHaveBeenCalledWith(1);
      expect(res.clearCookie).toHaveBeenCalledWith('accessToken');
      expect(res.clearCookie).toHaveBeenCalledWith('refreshToken');
    });

    it('should throw NotFoundException if user is not found', async () => {
      const res = { clearCookie: jest.fn() } as unknown as Response;
      jest.spyOn(userRepository, 'findUserById').mockResolvedValue(null);

      await expect(userService.deleteUser(1, res)).rejects.toThrow(NotFoundException);
    });
  });
});
