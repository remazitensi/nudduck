/**
 * File Name    : user.repository.ts
 * Description  : user repository
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.10    이승철      Created
 */

import { UserDto } from '@_auth/dto/user.dto';
import { UserHashtag } from '@_user/entity/hashtag.entity';
import { User } from '@_user/entity/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserHashtag)
    private readonly userHashtagRepository: Repository<UserHashtag>,
  ) {}

  // Provider로 사용자 찾기 (소셜 로그인용)
  async findUserByProvider(provider: string, providerId: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { provider, providerId },
      withDeleted: true,
    });
  }

  // User ID로 사용자 찾기
  async findUserById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id, deletedAt: null } });
  }

  // 닉네임으로 사용자 찾기
  async findUserByNickname(nickName: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { nickName } });
  }

  // 사용자 생성
  async createUser(userDto: UserDto): Promise<User> {
    const newUser = this.userRepository.create({
      provider: userDto.provider,
      providerId: userDto.providerId,
      name: userDto.name,
      email: userDto.email,
      nickName: userDto.nickName,
      imageUrl: userDto.imageUrl,
    });
    return this.userRepository.save(newUser);
  }

  // Refresh Token 업데이트
  async updateRefreshToken(userId: number, refreshToken: string): Promise<void> {
    await this.userRepository.update(userId, { refreshToken });
  }

  // 사용자 정보 업데이트
  async updateUser(user: User): Promise<void> {
    await this.userRepository.save(user);
  }

  // 해시태그 전체 추가
  async saveHashtags(userHashtags: UserHashtag[]): Promise<void> {
    await this.userHashtagRepository.save(userHashtags);
  }

  // 해시태그 찾기
  async findHashtagsByUserId(userId: number): Promise<string[]> {
    const hashtags = await this.userHashtagRepository.find({ where: { userId } });
    return hashtags.map((hashtag) => hashtag.name);
  }

  // 해시태그 삭제
  async removeHashtags(userId: number, hashtags: string[]): Promise<void> {
    await Promise.all(
      hashtags.map(async (tag) => {
        await this.userHashtagRepository.delete({ userId, name: tag });
      }),
    );
  }

  // 소프트 삭제 (사용자 계정 비활성화)
  async softDeleteUser(userId: number): Promise<void> {
    await this.userRepository.softDelete(userId);
  }
}
