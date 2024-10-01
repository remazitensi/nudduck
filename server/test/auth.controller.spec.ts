/**
 * File Name    : auth.controller.ts
 * Description  : auth controller 테스트
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.16    이승철      Created
 * 2024.09.17    이승철      Modified   디렉토리 변경
 * 2024.09.30    이승철      Modified   spyOn 제거 및 토큰 이름 변경
 */

import { AuthController } from '@_modules/auth/auth.controller';
import { AuthService } from '@_modules/auth/auth.service';
import { getAccessCookieOptions, getRefreshCookieOptions } from '@_modules/auth/utils/cookie-helper';
import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { OAuthUser } from 'common/interfaces/oauth-user.interface';
import { UserRequest } from 'common/interfaces/user-request.interface';
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
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('http://example.com'),
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
      redirect: jest.fn(),
    } as unknown as Response;
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

      authService.getSocialLogin = jest.fn().mockResolvedValue(tokens);

      const req = { user: userDto } as { user: OAuthUser };
      await controller.googleCallback(req, res);

      expect(authService.getSocialLogin).toHaveBeenCalledWith(userDto);
      expect(res.cookie).toHaveBeenCalledWith('_a', tokens.accessToken, getAccessCookieOptions());
      expect(res.cookie).toHaveBeenCalledWith('__r', tokens.refreshToken, getRefreshCookieOptions());
      expect(res.redirect).toHaveBeenCalledWith('http://example.com');
    });
  });

  describe('accessToken', () => {
    it('should throw BadRequestException if refreshToken is not provided', async () => {
      const req: UserRequest = {
        cookies: { __r: '' },
        user: undefined,
        get: jest.fn(),
        header: jest.fn(),
        accepts: jest.fn(),
      } as unknown as UserRequest;

      await expect(controller.accessToken(req, res)).rejects.toThrow(BadRequestException);
    });

    it('should regenerate access token and set cookie', async () => {
      const req: UserRequest = {
        cookies: { __r: 'valid_refresh_token' },
        user: undefined,
        get: jest.fn(),
        header: jest.fn(),
        accepts: jest.fn(),
      } as unknown as UserRequest;
      const newAccessToken = 'new_access_token';

      authService.regenerateAccessToken = jest.fn().mockResolvedValue(newAccessToken);

      await controller.accessToken(req, res);

      expect(authService.regenerateAccessToken).toHaveBeenCalledWith('valid_refresh_token');
      expect(res.cookie).toHaveBeenCalledWith('_a', newAccessToken, getAccessCookieOptions());
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: '엑세스 토큰이 재발급되었습니다.' });
    });
  });
});
