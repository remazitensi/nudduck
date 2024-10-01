/**
 * File Name    : auth.service.ts
 * Description  : auth service 테스트
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.16    이승철      Created
 * 2024.09.18    이승철      Modified    mockUser 속성에 인생그래프 추가
 * 2024.09.30    이승철      Modified    유저 엔티티에 커뮤니티와 코멘트 추가
 */

import { AuthRepository } from '@_modules/auth/auth.repository';
import { AuthService } from '@_modules/auth/auth.service';
import { FileUploadService } from '@_modules/file-upload/file-upload.service';
import { User } from '@_modules/user/entity/user.entity';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

describe('AuthService', () => {
  let authService: AuthService;
  let authRepository: jest.Mocked<AuthRepository>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: AuthRepository,
          useValue: {
            findUserByProvider: jest.fn(),
            updateUser: jest.fn(),
            updateRefreshToken: jest.fn(),
            createUser: jest.fn(),
            findUserByNickname: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
        {
          provide: FileUploadService,
          useValue: {
            getDefaultProfileImgURL: jest.fn().mockReturnValue('default-image-url'),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key) => {
              if (key === 'JWT_ACCESS_SECRET') return 'access-secret';
              if (key === 'JWT_REFRESH_SECRET') return 'refresh-secret';
            }),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    authRepository = module.get<AuthRepository>(AuthRepository) as jest.Mocked<AuthRepository>;
    jwtService = module.get<JwtService>(JwtService) as jest.Mocked<JwtService>;
  });

  describe('socialLogin', () => {
    it('should handle existing user login', async () => {
      const mockUser: User = {
        id: 1,
        provider: 'google',
        providerId: '1234567890',
        email: 'test@example.com',
        name: 'Test User',
        nickname: 'test1',
        imageUrl: 'test-url',
        refreshToken: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        hashtags: [],
        favoriteLifeGraph: null,
        lifeGraphs: [],
        comments: [],
        communities: [],
      };

      const userDto = { provider: 'google', providerId: '1234567890', email: 'test@example.com', name: 'Test User' };

      authRepository.findUserByProvider.mockResolvedValue(mockUser);
      authRepository.updateRefreshToken.mockResolvedValue(undefined);

      jwtService.sign.mockReturnValueOnce('access-token').mockReturnValueOnce('refresh-token');

      const tokens = await authService.getSocialLogin(userDto);

      expect(authRepository.findUserByProvider).toHaveBeenCalledWith(userDto.provider, userDto.providerId);
      expect(authRepository.updateRefreshToken).toHaveBeenCalledWith(mockUser.id, 'refresh-token');
      expect(tokens).toEqual({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });
    });

    it('should create a new user if user does not exist', async () => {
      const userDto = { provider: 'google', providerId: '1234567890', email: 'test@example.com', name: 'Test User' };
      const mockNewUser: User = {
        id: 1,
        provider: 'google',
        providerId: '1234567890',
        email: 'test@example.com',
        name: 'Test User',
        nickname: 'new1',
        imageUrl: 'default-image-url',
        refreshToken: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        hashtags: [],
        favoriteLifeGraph: null,
        lifeGraphs: [],
        comments: [],
        communities: [],
      };

      authRepository.findUserByProvider.mockResolvedValue(null);
      authRepository.createUser.mockResolvedValue(mockNewUser);
      authRepository.updateRefreshToken.mockResolvedValue(undefined);

      jwtService.sign.mockReturnValueOnce('access-token').mockReturnValueOnce('refresh-token');

      const tokens = await authService.getSocialLogin(userDto);

      expect(authRepository.findUserByProvider).toHaveBeenCalledWith(userDto.provider, userDto.providerId);
      expect(authRepository.createUser).toHaveBeenCalledWith(expect.objectContaining(userDto));
      expect(authRepository.updateRefreshToken).toHaveBeenCalledWith(mockNewUser.id, 'refresh-token');
      expect(tokens).toEqual({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });
    });
  });
});
