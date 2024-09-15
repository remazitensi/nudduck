/**
 * File Name    : user.repository.ts
 * Description  : user repository
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.10    이승철      Created
 * 2024.09.16    이승철      Modified    절대경로 변경, user.entity snakecase로 변경, 메서드 명명관행 
 * 2024.09.16    이승철      Modified    해시태그 중복체크 및 맵핑, bulk insert 반영
 */

import { UserDto } from '@_modules/auth/dto/user.dto';
import { UserHashtag } from '@_modules/user/entity/hashtag.entity';
import { User } from '@_modules/user/entity/user.entity';
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
  async findUserByProvider(provider: string, provider_id: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { provider, provider_id },
      withDeleted: true,
    });
  }

  // User ID로 사용자 찾기 (relations 옵션 추가)
  async findUserById(id: number, relations: string[] = []): Promise<User | null> {
    return this.userRepository.findOne({ 
      where: { id, deleted_at: null },
      relations,  // relations 옵션 추가
    });
  }

  // 닉네임으로 사용자 찾기
  async findUserByNickname(nickname: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { nickname } });
  }

  // 사용자 생성
  async createUser(userDto: UserDto): Promise<User> {
    const newUser = this.userRepository.create({
      provider: userDto.provider,
      provider_id: userDto.providerId,
      name: userDto.name,
      email: userDto.email,
      nickname: userDto.nickname,
      image_url: userDto.imageUrl,
    });
    return this.userRepository.save(newUser);
  }

  // Refresh Token 업데이트
  async updateRefreshToken(user_id: number, refresh_token: string): Promise<void> {
    await this.userRepository.update(user_id, { refresh_token });
  }

  // 사용자 정보 업데이트
  async updateUser(user: User): Promise<void> {
    await this.userRepository.save(user);
  }

  // 해시태그 전체 추가
  async createHashtags(userHashtags: UserHashtag[]): Promise<void> {
    await this.userHashtagRepository.save(userHashtags);
  }

  // 해시태그 찾기
  async findHashtagsByUserId(user_id: number): Promise<string[]> {
    const hashtags = await this.userHashtagRepository.find({
      where: { user: { id: user_id } },
    });
    return hashtags.map((hashtag) => hashtag.name);
  }

  // 해시태그 삭제
  async deleteHashtags(user_id: number, hashtags: string[]): Promise<void> {
    await Promise.all(
      hashtags.map((tag) => 
        this.userHashtagRepository.delete({ user: { id: user_id }, name: tag })
      ),
    );
  }

  // 소프트 삭제 (사용자 계정 비활성화)
  async deleteUser(user_id: number): Promise<void> {
    await this.userRepository.softDelete(user_id);
  }
}
