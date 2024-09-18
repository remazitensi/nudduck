/**
 * File Name    : user.service.ts
 * Description  : user service 테스트
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.16    이승철      Created
 * 2024.09.18    이승철      Modified    mockUser 속성에 인생그래프 추가
 */

import { FileUploadService } from '@_modules/file-upload/file-upload.service';
import { UserRepository } from '@_modules/user/user.repository';
import { UserService } from '@_modules/user/user.service';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource, QueryRunner } from 'typeorm';
import { User } from '@_modules/user/entity/user.entity';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: jest.Mocked<UserRepository>;
  let fileUploadService: jest.Mocked<FileUploadService>;
  let queryRunner: jest.Mocked<QueryRunner>;
  let dataSource: jest.Mocked<DataSource>;

  beforeEach(async () => {
    queryRunner = {
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
      manager: {
        save: jest.fn(),
      },
    } as unknown as jest.Mocked<QueryRunner>;

    dataSource = {
      createQueryRunner: jest.fn().mockReturnValue(queryRunner),
    } as unknown as jest.Mocked<DataSource>;

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
            deleteUser: jest.fn(),
            createHashtags: jest.fn(),
            deleteHashtags: jest.fn(),
          },
        },
        {
          provide: FileUploadService,
          useValue: {
            getDefaultProfileImgURL: jest.fn().mockReturnValue('default-image-url'),
          },
        },
        {
          provide: DataSource,
          useValue: dataSource, // Mock DataSource with the mock queryRunner
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<UserRepository>(UserRepository) as jest.Mocked<UserRepository>;
    fileUploadService = module.get<FileUploadService>(FileUploadService) as jest.Mocked<FileUploadService>;
  });

  describe('updateProfile', () => {
    it('should update user profile', async () => {
      const mockUser: User = {
        id: 1,
        provider: 'google',
        provider_id: '1234567890',
        name: 'Test User',
        email: 'test@example.com',
        nickname: 'testU',
        image_url: 'old-url',
        refresh_token: null,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
        hashtags: [],
        favorite_life_graph: null, 
        life_graphs: [],
      };

      const updateProfileDto = {
        nickname: 'newNickname',
        imageUrl: 'new-url',
        hashtags: ['newTag'],
      };

      userRepository.findUserById.mockResolvedValue(mockUser);
      userRepository.findUserByNickname.mockResolvedValue(null);

      await userService.updateProfile(1, updateProfileDto);

      expect(userRepository.findUserById).toHaveBeenCalledWith(1);
      expect(userRepository.findUserByNickname).toHaveBeenCalledWith('newNickname');
      expect(queryRunner.manager.save).toHaveBeenCalledWith(mockUser); // 트랜잭션 내에서 저장
      expect(queryRunner.commitTransaction).toHaveBeenCalled();
    });

    it('should rollback the transaction on error', async () => {
      const mockUser: User = {
        id: 1,
        provider: 'google',
        provider_id: '1234567890',
        name: 'Test User',
        email: 'test@example.com',
        nickname: 'testU',
        image_url: 'old-url',
        refresh_token: null,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
        hashtags: [],
        favorite_life_graph: null,
        life_graphs: [], 
      };

      const updateProfileDto = {
        nickname: 'newNickname',
        imageUrl: 'new-url',
        hashtags: ['newTag'],
      };

      userRepository.findUserById.mockResolvedValue(mockUser);
      userRepository.findUserByNickname.mockResolvedValue(null);
      (queryRunner.manager.save as jest.Mock).mockRejectedValue(new Error('DB Error')); // save를 mockRejectedValue로 모킹

      await expect(userService.updateProfile(1, updateProfileDto)).rejects.toThrow('DB Error');

      expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
    });

    it('should throw NotFoundException if user is not found', async () => {
      userRepository.findUserById.mockResolvedValue(null);

      await expect(userService.updateProfile(1, {})).rejects.toThrow(NotFoundException);
    });
  });
});
