import { AuthController } from '@_auth/auth.controller';
import { AuthService } from '@_auth/auth.service';
import { UserDto } from '@_auth/dto/user.dto';
import { OAuthUser } from '@_auth/interface/oauth-user.interface';
import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            socialLogin: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('googleAuth', () => {
    it('should handle Google social login', async () => {
      const result = await authController.googleAuth();
      expect(result).toBeUndefined(); // 메서드가 아무것도 반환하지 않기 때문에 undefined를 예상합니다.
    });
  });

  describe('googleCallback', () => {
    it('should call socialLogin with correct user data for Google login', async () => {
      const mockOAuthUser: OAuthUser = {
        provider: 'google',
        providerId: '1234567890',
        email: 'test@example.com',
        name: 'Test User',
      };
      const req = { user: mockOAuthUser };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;

      const userDto: UserDto = {
        provider: 'google',
        providerId: mockOAuthUser.providerId,
        email: mockOAuthUser.email,
        name: mockOAuthUser.name,
      };

      await authController.googleCallback(req, res);

      expect(authService.socialLogin).toHaveBeenCalledWith(userDto, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith('Login successful');
    });
  });

  describe('kakaoAuth', () => {
    it('should handle Kakao social login', async () => {
      const result = await authController.kakaoAuth();
      expect(result).toBeUndefined(); // 메서드가 아무것도 반환하지 않기 때문에 undefined를 예상합니다.
    });
  });

  describe('kakaoAuthCallback', () => {
    it('should call socialLogin with correct user data for Kakao login', async () => {
      const mockOAuthUser: OAuthUser = {
        provider: 'kakao',
        providerId: '0987654321',
        email: 'test@kakao.com',
        name: 'Kakao User',
      };
      const req = { user: mockOAuthUser };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;

      const userDto: UserDto = {
        provider: 'kakao',
        providerId: mockOAuthUser.providerId,
        email: mockOAuthUser.email,
        name: mockOAuthUser.name,
      };

      await authController.kakaoAuthCallback(req, res);

      expect(authService.socialLogin).toHaveBeenCalledWith(userDto, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith('Login successful');
    });
  });
});
