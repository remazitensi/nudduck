import { ProfileDto } from '@_user/dto/profile.dto';
import { UpdateProfileDto } from '@_user/dto/update-profile.dto';
import { UserController } from '@_user/user.controller';
import { UserService } from '@_user/user.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            getProfile: jest.fn(),
            updateProfile: jest.fn(),
            logout: jest.fn(),
            deleteUser: jest.fn(),
          },
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('getProfile', () => {
    it('should return a profile', async () => {
      const mockProfile: ProfileDto = {
        nickname: 'tUser',
        email: 'test@example.com',
        name: 'Test User',
        imageUrl: 'http://example.com/test.jpg',
        hashtags: ['deper', 'blog'],
      };
      jest.spyOn(userService, 'getProfile').mockResolvedValue(mockProfile);

      const req = { user: { id: 1 } };
      const result = await userController.getProfile(req);

      expect(result).toEqual(mockProfile);
      expect(userService.getProfile).toHaveBeenCalledWith(1);
    });
  });

  describe('updateProfile', () => {
    it('should update user profile', async () => {
      const mockUpdateProfileDto: UpdateProfileDto = {
        nickname: 'newNic',
        imageUrl: 'http://example.com/new.jpg',
        hashtags: ['newTa'],
      };
      const req = { user: { id: 1 } };

      jest.spyOn(userService, 'updateProfile').mockResolvedValue(undefined);

      const result = await userController.updateProfile(req, mockUpdateProfileDto);

      expect(result).toEqual({ message: '회원정보가 수정되었습니다.' });
      expect(userService.updateProfile).toHaveBeenCalledWith(1, mockUpdateProfileDto);
    });
  });

  describe('logout', () => {
    it('should log out the user', async () => {
      const req = { user: { id: 1 } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        clearCookie: jest.fn(),
      };

      jest.spyOn(userService, 'logout').mockResolvedValue(undefined);

      await userController.logout(req, res as any);

      expect(userService.logout).toHaveBeenCalledWith(1, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: '로그아웃 되었습니다.' });
    });
  });

  describe('deleteAccount', () => {
    it('should delete the user account', async () => {
      const req = { user: { id: 1 } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        clearCookie: jest.fn(),
      };

      jest.spyOn(userService, 'deleteUser').mockResolvedValue(undefined);

      await userController.deleteAccount(req, res as any);

      expect(userService.deleteUser).toHaveBeenCalledWith(1, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: '회원탈퇴가 완료되었습니다.' });
    });
  });
});
