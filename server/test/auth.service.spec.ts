/**
 * File Name    : auth.service.spec.ts
 * Description  : auth 서비스 유닛테스트
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.07    이승철      Created
 * 2024.09.07    이승철      Modified    서비스 메서드 유닛테스트
 * 2024.09.08    이승철      Modified    통합 test폴더로 위치 변경
 */

import { AuthRepository } from '@_auth/auth.repository';
import { AuthService } from '@_auth/auth.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';

describe('AuthService', () => {
  let authService: AuthService;
  let authRepository: AuthRepository;
  let jwtService: JwtService;
  let configService: ConfigService;

  // Mock Response 객체
  const mockResponse = (): Partial<Response> => {
    return {
      cookie: jest.fn(), // res.cookie 모의 처리
    } as Partial<Response>;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: AuthRepository,
          useValue: {
            findUserByProvider: jest.fn(),
            createUser: jest.fn(),
            updateRefreshToken: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    authRepository = module.get<AuthRepository>(AuthRepository);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should call findUserByProvider on social login', async () => {
    const mockUserDto = { provider: 'google', providerId: '12345', email: 'test@test.com', name: 'Test User' };

    const mockUser = {
      id: 1,
      provider: 'google',
      providerId: '12345',
      email: 'test@test.com',
      name: 'Test User',
      refreshToken: 'mockRefreshToken',
      imageUrl: 'https://example.com/avatar.png',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    const res = mockResponse() as Response;

    jest.spyOn(authRepository, 'findUserByProvider').mockResolvedValueOnce(null);
    jest.spyOn(authRepository, 'createUser').mockResolvedValueOnce(mockUser);
    jest.spyOn(jwtService, 'sign').mockReturnValue('mockAccessToken');

    await authService.socialLogin(mockUserDto, res);

    expect(authRepository.findUserByProvider).toHaveBeenCalledWith('google', '12345');
    expect(authRepository.createUser).toHaveBeenCalledWith(mockUserDto);
    expect(res.cookie).toHaveBeenCalledTimes(2); // 쿠키가 설정되었는지 확인
    expect(res.cookie).toHaveBeenCalledWith('accessToken', 'mockAccessToken', expect.any(Object));
  });
});
