/**
 * File Name    : auth.controller.ts
 * Description  : auth controller 테스트
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.16    이승철      Created
 */

import { AuthService } from '@_modules/auth/auth.service';
import { AuthController } from '@_modules/auth/auth.controller';
import { RefreshTokenDto } from '@_modules/auth/dto/refresh-token.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { OAuthUser } from '@_modules/auth/utils/oauth-user.interface';
import { BadRequestException } from '@nestjs/common';
import { getAccessCookieOptions, getRefreshCookieOptions } from '@_modules/auth/utils/cookie-helper';
import { Response } from 'express';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let res: Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            getSocialLogin: jest.fn(),
            regenerateAccessToken: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    res = {
      cookie: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    } as unknown as Response; // Mock Express Response
  });

  describe('googleCallback', () => {
    it('should set cookies and return successful login', async () => {
      const userDto = {
        provider: 'google',
        providerId: '123',
        email: 'test@test.com',
        name: 'John Doe',
      };
      const tokens = { accessToken: 'access_token', refreshToken: 'refresh_token' };

      jest.spyOn(authService, 'getSocialLogin').mockResolvedValue(tokens);

      const req = { user: userDto } as { user: OAuthUser };
      await controller.googleCallback(req, res);

      expect(authService.getSocialLogin).toHaveBeenCalledWith(userDto);
      expect(res.cookie).toHaveBeenCalledWith('accessToken', tokens.accessToken, getAccessCookieOptions());
      expect(res.cookie).toHaveBeenCalledWith('refreshToken', tokens.refreshToken, getRefreshCookieOptions());
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith('Login successful');
    });
  });

  describe('accessToken', () => {
    it('should throw BadRequestException if refreshToken is not provided', async () => {
      const refreshTokenDto: RefreshTokenDto = { refreshToken: '' };

      await expect(controller.accessToken(refreshTokenDto, res)).rejects.toThrow(BadRequestException);
    });

    it('should regenerate access token and set cookie', async () => {
      const refreshTokenDto: RefreshTokenDto = { refreshToken: 'valid_refresh_token' };
      const newAccessToken = 'new_access_token';

      jest.spyOn(authService, 'regenerateAccessToken').mockResolvedValue(newAccessToken);

      await controller.accessToken(refreshTokenDto, res);

      expect(authService.regenerateAccessToken).toHaveBeenCalledWith(refreshTokenDto.refreshToken);
      expect(res.cookie).toHaveBeenCalledWith('accessToken', newAccessToken, getAccessCookieOptions());
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: '엑세스 토큰이 재발급되었습니다.' });
    });
  });
});
