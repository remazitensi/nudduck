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
 * 2024.09.24    이승철      Modified    나의 게시글, 카운트 추가
 * 2024.09.24    이승철      Modified    카멜케이스로 변경
 */

import { UserDto } from '@_modules/auth/dto/user.dto';
import { Community } from '@_modules/community/entities/community.entity';
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
    @InjectRepository(Community)
    private readonly communityRepository: Repository<Community>,
  ) {}

  // Provider로 사용자 찾기 (소셜 로그인용)
  async findUserByProvider(provider: string, providerId: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { provider, providerId },
      withDeleted: true,
    });
  }

  // 게시글 찾기
  async findMyPosts(userId: number, page: number, limit: number): Promise<Community[]> {
    return this.communityRepository.find({
      where: { user: { id: userId } },
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
  }

  // 게시글 카운트
  async countMyPosts(userId: number): Promise<number> {
    return this.communityRepository.count({
      where: { user: { id: userId } },
    });
  }

  // User ID로 사용자 찾기 (relations 옵션 추가)
  async findUserById(id: number, relations: string[] = []): Promise<User | null> {
    return this.userRepository.findOne({ 
      where: { id, deletedAt: null },
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
      providerId: userDto.providerId,
      name: userDto.name,
      email: userDto.email,
      nickname: userDto.nickname,
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
  async createHashtags(userHashtags: UserHashtag[]): Promise<void> {
    await this.userHashtagRepository.save(userHashtags);
  }

  // 해시태그 찾기
  async findHashtagsByUserId(userId: number): Promise<string[]> {
    const hashtags = await this.userHashtagRepository.find({
      where: { user: { id: userId } },
    });
    return hashtags.map((hashtag) => hashtag.name);
  }

  // 해시태그 삭제
  async deleteHashtags(userId: number, hashtags: string[]): Promise<void> {
    await Promise.all(
      hashtags.map((tag) => 
        this.userHashtagRepository.delete({ user: { id: userId }, name: tag })
      ),
    );
  }

  // 소프트 삭제 (사용자 계정 비활성화)
  async deleteUser(userId: number): Promise<void> {
    await this.userRepository.softDelete(userId);
  }
}
