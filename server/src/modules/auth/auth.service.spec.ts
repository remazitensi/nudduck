import { FileUploadService } from '@_file-upload/file-upload.service';
import { User } from '@_user/entity/user.entity';
import { NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { AuthRepository } from './auth.repository';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let authRepository: AuthRepository;
  let jwtService: JwtService;
  let fileUploadService: FileUploadService;
  let configService: ConfigService;

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
            findUserById: jest.fn(),
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
    authRepository = module.get<AuthRepository>(AuthRepository);
    jwtService = module.get<JwtService>(JwtService);
    fileUploadService = module.get<FileUploadService>(FileUploadService);
    configService = module.get<ConfigService>(ConfigService);
  });

  describe('socialLogin', () => {
    it('should handle existing user login', async () => {
      const mockUser: User = {
        id: 1,
        provider: 'google',
        providerId: '1234567890',
        email: 'test@example.com',
        name: 'Test User',
        nickName: 'test1',
        imageUrl: 'test-url',
        refreshToken: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };
      const userDto = { provider: 'google', providerId: '1234567890', email: 'test@example.com', name: 'Test User' };
      const res = { cookie: jest.fn() } as unknown as Response;

      jest.spyOn(authRepository, 'findUserByProvider').mockResolvedValue(mockUser);
      jest.spyOn(authRepository, 'updateRefreshToken').mockResolvedValue(undefined);

      // 직접 private 메서드를 스파이하지 않고 public 메서드에서 처리되는 로직을 검증
      jest.spyOn(authService as any, 'generateTokens').mockReturnValue({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });

      await authService.socialLogin(userDto, res);

      expect(authRepository.findUserByProvider).toHaveBeenCalledWith(userDto.provider, userDto.providerId);
      expect(authRepository.updateRefreshToken).toHaveBeenCalledWith(mockUser.id, 'refresh-token');
      expect(res.cookie).toHaveBeenCalledWith('accessToken', 'access-token', expect.any(Object));
      expect(res.cookie).toHaveBeenCalledWith('refreshToken', 'refresh-token', expect.any(Object));
    });

    it('should create a new user if user does not exist', async () => {
      const userDto = { provider: 'google', providerId: '1234567890', email: 'test@example.com', name: 'Test User' };
      const res = { cookie: jest.fn() } as unknown as Response;
      const mockNewUser: User = {
        id: 1,
        provider: 'google',
        providerId: '1234567890',
        email: 'test@example.com',
        name: 'Test User',
        nickName: 'new1',
        imageUrl: 'default-image-url',
        refreshToken: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      jest.spyOn(authRepository, 'findUserByProvider').mockResolvedValue(null);
      // 'createNewUser'도 private이기 때문에 직접 테스트하지 않고 호출되는지 확인
      jest.spyOn(authService as any, 'createNewUser').mockResolvedValue(mockNewUser);
      jest.spyOn(authRepository, 'updateRefreshToken').mockResolvedValue(undefined);
      jest.spyOn(authService as any, 'generateTokens').mockReturnValue({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });

      await authService.socialLogin(userDto, res);

      expect(authRepository.findUserByProvider).toHaveBeenCalledWith(userDto.provider, userDto.providerId);
      expect(authService['createNewUser']).toHaveBeenCalledWith(userDto);
      expect(authRepository.updateRefreshToken).toHaveBeenCalledWith(mockNewUser.id, 'refresh-token');
      expect(res.cookie).toHaveBeenCalledWith('accessToken', 'access-token', expect.any(Object));
      expect(res.cookie).toHaveBeenCalledWith('refreshToken', 'refresh-token', expect.any(Object));
    });
  });

  describe('findUserById', () => {
    it('should return the user if found', async () => {
      const mockUser: User = {
        id: 1,
        provider: 'google',
        providerId: '1234567890',
        email: 'test@example.com',
        name: 'Test User',
        nickName: 'test1',
        imageUrl: 'test-url',
        refreshToken: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      jest.spyOn(authRepository, 'findUserById').mockResolvedValue(mockUser);

      const result = await authService.findUserById(1);

      expect(authRepository.findUserById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user is not found', async () => {
      jest.spyOn(authRepository, 'findUserById').mockResolvedValue(null);

      await expect(authService.findUserById(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('generateTokens', () => {
    it('should generate access and refresh tokens', () => {
      const mockUser: User = {
        id: 1,
        provider: 'google',
        providerId: '1234567890',
        email: 'test@example.com',
        name: 'Test User',
        nickName: 'test1',
        imageUrl: 'test-url',
        refreshToken: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      const tokens = (authService as any).generateTokens(mockUser);

      expect(jwtService.sign).toHaveBeenCalledTimes(2);
      expect(tokens).toEqual({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
      });
    });
  });
});
