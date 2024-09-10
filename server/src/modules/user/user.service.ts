/**
 * File Name    : user.service.ts
 * Description  : user 서비스 로직
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.10    이승철      Created
 */

import { FileUploadService } from '@_file-upload/file-upload.service';
import { ProfileDto } from '@_user/dto/profile.dto';
import { UpdateProfileDto } from '@_user/dto/update-profile.dto';
import { UserHashtag } from '@_user/entity/hashtag.entity';
import { UserRepository } from '@_user/user.repository';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly fileUploadService: FileUploadService,
  ) {}

  async getProfile(userId: number): Promise<ProfileDto> {
    // 유저 정보 조회
    const user = await this.userRepository.findUserById(userId);
    if (!user) {
      throw new NotFoundException('회원을 찾을 수 없습니다.');
    }

    // 해시태그 정보 조회
    const hashtags = await this.userRepository.findHashtagsByUserId(userId);

    // 프로필 정보 조합
    const profile: ProfileDto = {
      nickname: user.nickName,
      email: user.email,
      name: user.name,
      imageUrl: user.imageUrl,
      hashtags: hashtags,
    };

    return profile;
  }

  @Transactional()
  async updateProfile(userId: number, updateProfileDto: UpdateProfileDto): Promise<void> {
    const user = await this.userRepository.findUserById(userId);
    if (!user) {
      throw new NotFoundException('회원을 찾을 수 없습니다.');
    }

    // 닉네임 유효성 검사 및 업데이트
    await this.updateNickname(user, updateProfileDto.nickname);

    // 프로필 이미지 수정/삭제
    await this.updateProfileImage(user, updateProfileDto.imageUrl);

    // 해시태그 수정
    await this.updateHashtags(userId, updateProfileDto.hashtags);

    // 변경 사항을 DB에 저장
    await this.userRepository.updateUser(user);
  }

  private async updateNickname(user, nickname: string): Promise<void> {
    if (nickname && user.nickName !== nickname) {
      const existingUser = await this.userRepository.findUserByNickname(nickname);
      if (existingUser) {
        throw new ConflictException('이미 사용 중인 닉네임입니다.');
      }
      user.nickName = nickname;
    }
  }

  private async updateProfileImage(user, imageUrl: string): Promise<void> {
    if (imageUrl !== undefined) {
      if (imageUrl === '') {
        user.imageUrl = this.fileUploadService.getDefaultProfileImgURL(); // 기본 이미지로 설정
      } else {
        user.imageUrl = imageUrl; // 새 이미지 URL 설정
      }
    }
  }

  private async updateHashtags(userId: number, hashtags?: string[]): Promise<void> {
    if (hashtags !== undefined) {
      const currentHashtags = await this.userRepository.findHashtagsByUserId(userId);

      const hashtagsToAdd = hashtags.filter((tag) => !currentHashtags.includes(tag));
      const hashtagsToRemove = currentHashtags.filter((tag) => !hashtags.includes(tag));

      if (hashtagsToRemove.length > 0) {
        await this.userRepository.removeHashtags(userId, hashtagsToRemove);
      }

      if (hashtagsToAdd.length > 0) {
        for (const tag of hashtagsToAdd) {
          const userHashtag = new UserHashtag();
          userHashtag.userId = userId;
          userHashtag.name = tag;
          await this.userRepository.saveHashtags([userHashtag]);
        }
      }
    }
  }

  async logout(userId: number, res: Response): Promise<void> {
    const user = await this.userRepository.findUserById(userId);
    if (!user) {
      throw new NotFoundException('회원을 찾을 수 없습니다.');
    }

    user.refreshToken = null;
    await this.userRepository.updateUser(user);

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
  }

  async deleteUser(userId: number, res: Response): Promise<void> {
    const user = await this.userRepository.findUserById(userId);
    if (!user) {
      throw new NotFoundException('회원을 찾을 수 없습니다.');
    }

    await this.userRepository.softDeleteUser(userId);

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
  }
}
