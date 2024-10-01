/**
 * File Name    : user.service.ts
 * Description  : user service 테스트
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.16    이승철      Created
 * 2024.09.18    이승철      Modified    mockUser 속성에 인생그래프 추가
 * 2024.09.30    이승철      Modified    내 정보 조회 api 추가 및 토큰 이름 변경
 */

import { FileUploadService } from '@_modules/file-upload/file-upload.service';
import { MyInfoDto } from '@_modules/user/dto/my-info.dto';
import { MyPaginationQueryDto } from '@_modules/user/dto/my-pagination-query.dto';
import { MyProfileDto } from '@_modules/user/dto/my-profile.dto';
import { UpdateMyProfileDto } from '@_modules/user/dto/update-my-profile.dto';
import { User } from '@_modules/user/entity/user.entity';
import { UserRepository } from '@_modules/user/user.repository';
import { UserService } from '@_modules/user/user.service';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: UserRepository;
  let fileUploadService: FileUploadService;

  const mockUserRepository = {
    findUserById: jest.fn(),
    countMyPosts: jest.fn(),
    findMyPosts: jest.fn(),
    findFavoriteLifeGraph: jest.fn(),
    updateUser: jest.fn(),
    findHashtagsByUserId: jest.fn(),
    createHashtags: jest.fn(),
  };

  const mockDataSource = {
    createQueryRunner: jest.fn().mockReturnValue({
      startTransaction: jest.fn(),
      manager: {
        findOne: jest.fn(),
        save: jest.fn(),
      },
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
    }),
  };

  const mockFileUploadService = {
    getDefaultProfileImgURL: jest.fn().mockReturnValue('https://example.com/default-profile.jpg'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: UserRepository, useValue: mockUserRepository },
        { provide: DataSource, useValue: mockDataSource },
        { provide: FileUploadService, useValue: mockFileUploadService },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<UserRepository>(UserRepository);
    fileUploadService = module.get<FileUploadService>(FileUploadService);
  });

  describe('getMyProfileWithPosts', () => {
    it('should return user profile with posts', async () => {
      const mockUser: User = {
        id: 1,
        nickname: 'JohnDoe',
        email: 'john.doe@example.com',
        name: 'John Doe',
        imageUrl: 'https://example.com/profile.jpg',
        hashtags: [],
        favoriteLifeGraph: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        communities: [],
        comments: [],
        lifeGraphs: [],
        provider: '',
        providerId: '',
        refreshToken: '',
      };

      const mockProfile: MyProfileDto = {
        nickname: 'JohnDoe',
        email: 'john.doe@example.com',
        name: 'John Doe',
        imageUrl: 'https://example.com/profile.jpg',
        hashtags: [],
        favoriteLifeGraph: null,
        posts: [],
        totalCount: 0,
        createdAt: new Date(),
      };

      mockUserRepository.findUserById.mockResolvedValue(mockUser);
      mockUserRepository.countMyPosts.mockResolvedValue(0);
      mockUserRepository.findMyPosts.mockResolvedValue([]);
      mockUserRepository.findFavoriteLifeGraph.mockResolvedValue(null);

      const pagination: MyPaginationQueryDto = { page: 1, limit: 10 };
      const result = await userService.getMyProfileWithPosts(1, pagination);

      expect(userRepository.findUserById).toHaveBeenCalledWith(1, ['favoriteLifeGraph', 'hashtags']);
      expect(result).toEqual(mockProfile);
    });

    it('should throw NotFoundException if user is not found', async () => {
      mockUserRepository.findUserById.mockResolvedValue(null);

      await expect(userService.getMyProfileWithPosts(1, { page: 1, limit: 10 })).rejects.toThrow(NotFoundException);
    });
  });

  describe('getMyInfoById', () => {
    it('should return user info', async () => {
      const mockUser: User = {
        id: 1,
        nickname: 'JohnDoe',
        email: 'john.doe@example.com',
        name: 'John Doe',
        imageUrl: 'https://example.com/profile.jpg',
        hashtags: [],
        favoriteLifeGraph: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        communities: [],
        comments: [],
        lifeGraphs: [],
        provider: '',
        providerId: '',
        refreshToken: '',
      };

      const mockInfo: MyInfoDto = {
        id: 1,
        nickname: 'JohnDoe',
        email: 'john.doe@example.com',
        imageUrl: 'https://example.com/profile.jpg',
        name: 'John Doe',
      };

      mockUserRepository.findUserById.mockResolvedValue(mockUser);

      const result = await userService.getMyInfoById(1);

      expect(userRepository.findUserById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockInfo);
    });

    it('should throw NotFoundException if user is not found', async () => {
      mockUserRepository.findUserById.mockResolvedValue(null);

      await expect(userService.getMyInfoById(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateMyProfile', () => {
    it('should update user profile', async () => {
      const mockUser: User = {
        id: 1,
        nickname: 'JohnDoe',
        email: 'john.doe@example.com',
        name: 'John Doe',
        imageUrl: 'https://example.com/profile.jpg',
        hashtags: [],
        favoriteLifeGraph: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        communities: [],
        comments: [],
        lifeGraphs: [],
        provider: '',
        providerId: '',
        refreshToken: '',
      };

      const mockUpdateDto: UpdateMyProfileDto = {
        nickname: 'newNickName',
        imageUrl: 'https://example.com/new-image.jpg',
        hashtags: ['#developer'],
      };

      const queryRunner = mockDataSource.createQueryRunner();

      // findOne에서 사용자를 찾은 것으로 목킹
      queryRunner.manager.findOne.mockResolvedValueOnce(mockUser); // 사용자를 찾은 것으로 목킹

      // 닉네임 중복 검사를 피하기 위해 null 반환
      queryRunner.manager.findOne.mockResolvedValueOnce(null); // 닉네임 중복 체크에서 중복되지 않도록 설정

      // findHashtagsByUserId 메서드를 목킹하여 빈 배열 반환
      mockUserRepository.findHashtagsByUserId = jest.fn().mockResolvedValue([]);

      await userService.updateMyProfile(1, mockUpdateDto);

      expect(queryRunner.manager.save).toHaveBeenCalled();
      expect(queryRunner.commitTransaction).toHaveBeenCalled();
    });
  });
});
