/**
 * File Name    : auth.service.ts
 * Description  : auth 서비스 로직
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.07    이승철      Created
 * 2024.09.07    이승철      Modified    구글, 카카오 로그인 및 인가처리
 * 2024.09.08    이승철      Modified    예외처리 및 리팩토링
 * 2024.09.08    이승철      Modified    회원가입 시, 임의로 닉네임 추가
 * 2024.09.09    이승철      Modified    findUserById 메서드 user.repository로 경로 변경
 * 2024.09.09    이승철      Modified    쿠키에 sameSite:lax(CSRF 방지) 추가
 * 2024.09.10    이승철      Modified    accessToken 재발급 로직 삭제 및 유효기간 3일로 변경
 * 2024.09.10    이승철      Modified    회원가입 시, 기본이미지 설정 로직 추가
 * 2024.09.10    이승철      Modified    회원탈퇴 후, 재가입 로직 구현
 * 2024.09.11    이승철      Modified    accessToken 재발급 로직 재추가
 * 2024.09.16    이승철      Modified    쿠키발급 컨트롤러로 이전, nickname으로 변경, User.entity에 snakecase 적용, 절대경로 변경
 * 2024.09.24    이승철      Modified    카멜케이스로 변경
 * 2024.09.24    이승철      Modified    엑세스 토큰 재발급 로직 수정
 */

import { AuthRepository } from '@_modules/auth/auth.repository';
import { UserDto } from '@_modules/auth/dto/user.dto';
import { FileUploadService } from '@_modules/file-upload/file-upload.service';
import { User } from '@_modules/user/entity/user.entity';
import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { customAlphabet } from 'nanoid';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  // 구글/카카오 로그인 처리
  async getSocialLogin(userDto: UserDto): Promise<{ accessToken: string; refreshToken: string }> {
    const existingUser = await this.authRepository.findUserByProvider(userDto.provider, userDto.providerId);

    if (existingUser) {
      if (existingUser.deletedAt) {
        // 탈퇴한 계정이라면 재가입 처리
        existingUser.deletedAt = null;
        await this.authRepository.updateUser(existingUser);
      }
      const tokens = this.generateTokens(existingUser);
      await this.authRepository.updateRefreshToken(existingUser.id, tokens.refreshToken);
      return tokens;
    } else {
      // 신규 사용자 생성
      const user = await this.createNewUser(userDto);
      const tokens = this.generateTokens(user);
      await this.authRepository.updateRefreshToken(user.id, tokens.refreshToken);
      return tokens;
    }
  }

  // 신규 사용자 생성
  private async createNewUser(userDto: UserDto): Promise<User> {
    // 임의의 닉네임 생성
    const nickname = await this.createNewNickname();
    const imageUrl = this.fileUploadService.getDefaultProfileImgURL(); // 기본 이미지 URL 가져오기
    const newUserDto = { ...userDto, nickname, imageUrl }; // 기본 이미지 추가
    return await this.authRepository.createUser(newUserDto);
  }

  // 고유한 닉네임 생성 로직
  private async createNewNickname(): Promise<string> {
    const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const NICKNAME_LENGTH = 6;
    const nanoid = customAlphabet(alphabet, NICKNAME_LENGTH);

    const nickname = nanoid();
    const existingNickname = await this.authRepository.findUserByNickname(nickname);

    if (existingNickname) {
      return await this.createNewNickname(); // 닉네임이 중복되면 다시 재귀 호출하여 새로운 닉네임 생성
    }

    return nickname; // 닉네임이 중복되지 않으면 반환
  }

  // 토큰 생성
  private generateTokens(user: User): { accessToken: string; refreshToken: string } {
    const payload = { sub: user.providerId, provider: user.provider, email: user.email };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_SECRET'),
      expiresIn: '1h',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: '3d',
    });

    return { accessToken, refreshToken };
  }

  // 리프레시 토큰 검증 및 AccessToken 재발급
  async regenerateAccessToken(refreshToken: string): Promise<string> {
    const payload = this.jwtService.verify(refreshToken, {
      secret: process.env.JWT_REFRESH_SECRET,
    });

    const user = await this.authRepository.findUserByProvider(payload.provider, payload.sub);
    if (!user) {
      throw new UnauthorizedException('사용자를 찾을 수 없습니다.');
    }

    if (user.refreshToken !== refreshToken) {
      throw new ForbiddenException('리프레시 토큰이 일치하지 않습니다.');
    }

    const accessToken = this.jwtService.sign(
      { sub: user.providerId, provider: user.provider, email: user.email },
      {
        secret: this.configService.get('JWT_ACCESS_SECRET'),
        expiresIn: '1h',
      },
    );

    return accessToken;
  }
}
