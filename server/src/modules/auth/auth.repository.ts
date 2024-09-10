/**
 * File Name    : auth.repository.ts
 * Description  : auth repository
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.07    이승철      Created
 * 2024.09.07    이승철      Modified    db 유저 조회, 생성, rf토큰 업데이트 로직 구현
 * 2024.09.08    이승철      Modified    닉네임 중복확인 로직
 * 2024.09.09    이승철      Modified    findUserById 메서드 user.repository로 경로 변경
 * 2024.09.10    이승철      Modified    AuthRepository의 사용자 관련 책임을 UserRepository로 이동
 */

import { UserDto } from '@_auth/dto/user.dto';
import { User } from '@_user/entity/user.entity';
import { UserRepository } from '@_user/user.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthRepository {
  constructor(private readonly userRepository: UserRepository) {}

  // 소셜 로그인 제공자와 사용자 고유 ID로 사용자 조회
  async findUserByProvider(provider: string, providerId: string): Promise<User | null> {
    return this.userRepository.findUserByProvider(provider, providerId);
  }

  // 사용자 ID로 조회
  async findUserById(id: number): Promise<User> {
    return this.userRepository.findUserById(id);
  }

  // 사용자 닉네임으로 사용자 조회 (닉네임 중복 확인용)
  async findUserByNickname(nickName: string): Promise<User | null> {
    return this.userRepository.findUserByNickname(nickName);
  }

  // 사용자 생성
  async createUser(userDto: UserDto): Promise<User> {
    return this.userRepository.createUser(userDto);
  }

  // 사용자 업데이트 (탈퇴한 계정 재가입 시 사용)
  async updateUser(user: User): Promise<void> {
    await this.userRepository.updateUser(user);
  }

  // 리프레시 토큰 업데이트
  async updateRefreshToken(userId: number, refreshToken: string): Promise<void> {
    await this.userRepository.updateRefreshToken(userId, refreshToken);
  }
}
