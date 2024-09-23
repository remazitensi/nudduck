/**
 * File Name    : user.service.ts
 * Description  : user 서비스 로직
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.10    이승철      Created
 * 2024.09.16    이승철      Modified    절대경로 변경, 쿠키삭제 로직 컨트롤러로 이전
 * 2024.09.16    이승철      Modified    수동 트랜잭션으로 변경, 프로필 수정(undefined, 기존과 동일의 경우) if 조건문 적용
 * 2024.09.17    이승철      Modified    getMyProfile로 메서드 이름 변경 및 인생그래프 즐겨찾기 함께 조회
 * 2024.09.23    이승철      Modified    favoriteLifeGraph => favorite_life-graph로 변경
 * 2024.09.23    이승철      Modified    MyProfileDto로 변경
 * 2024.09.24    이승철      Modified    프로필 조회 나의 게시글 포함
 * 2024.09.24    이승철      Modified    카멜케이스로 변경
 */

import { FileUploadService } from '@_modules/file-upload/file-upload.service';
import { LifeGraphRepository } from '@_modules/life-graph/life-graph.repository';
import { MyProfileDto } from '@_modules/user/dto/my-profile.dto';
import { UpdateProfileDto } from '@_modules/user/dto/update-profile.dto';
import { UserHashtag } from '@_modules/user/entity/hashtag.entity';
import { User } from '@_modules/user/entity/user.entity';
import { UserRepository } from '@_modules/user/user.repository';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { MyPaginationQueryDto } from '@_modules/user/dto/my-pagination-query.dto';
import { CommunitySummaryDto } from './dto/community-summary.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly lifeGraphRepository: LifeGraphRepository,
    private readonly fileUploadService: FileUploadService,
    private readonly dataSource: DataSource,
  ) {}

  async getMyProfileWithPosts(
    userId: number,
    myPaginationQueryDto: MyPaginationQueryDto
  ): Promise<MyProfileDto> {
    const user = await this.userRepository.findUserById(userId, ['favoriteLifeGraph', 'hashtags']);
    if (!user) {
      throw new NotFoundException('회원을 찾을 수 없습니다.');
    }
  
    const hashtags = user.hashtags.map((hashtag) => hashtag.name);
  
    const favoriteLifeGraph = user.favoriteLifeGraph
      ? await this.lifeGraphRepository.findOneLifeGraph(user.favoriteLifeGraph.id, user.id, {
          relations: ['events'],
        })
      : null;
  
    const page = Math.max(myPaginationQueryDto.page, 1);
    const limit = myPaginationQueryDto.limit;
  
    const totalCount = await this.userRepository.countMyPosts(userId);
    const totalPages = Math.ceil(totalCount / limit);
    const finalPage = totalPages === 0 ? 1 : Math.min(page, totalPages);
  
    const posts = await this.userRepository.findMyPosts(userId, finalPage, limit);
  
    const postSummaries = posts.map((post) => new CommunitySummaryDto(post));
  
    const profile: MyProfileDto = {
      nickname: user.nickname,
      email: user.email,
      name: user.name,
      imageUrl: user.imageUrl,
      hashtags,
      favoriteLifeGraph,
      posts: postSummaries,
      totalCount,
    };
  
    return profile;
  }

  async updateProfile(userId: number, updateProfileDto: UpdateProfileDto): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const user = await this.userRepository.findUserById(userId);
      if (!user) {
        throw new NotFoundException('회원을 찾을 수 없습니다.');
      }

      // 닉네임 유효성 검사 및 업데이트 (닉네임이 undefined가 아니고 기존과 다른 경우에만)
      if (updateProfileDto.nickname && user.nickname !== updateProfileDto.nickname) {
        await this.updateNickname(user, updateProfileDto.nickname);
      }

      // 프로필 이미지 수정/삭제 (imageUrl이 undefined가 아니고 기존과 다른 경우에만)
      if (updateProfileDto.imageUrl && user.imageUrl !== updateProfileDto.imageUrl) {
        await this.updateProfileImage(user, updateProfileDto.imageUrl);
      }

      // 해시태그 수정 (해시태그가 undefined가 아니고 기존과 다른 경우에만)
      if (updateProfileDto.hashtags && updateProfileDto.hashtags.length > 0) {
        await this.updateHashtags(userId, updateProfileDto.hashtags);
      }

      // 변경 사항을 DB에 저장
      await queryRunner.manager.save(user);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private async updateNickname(user, nickname: string): Promise<void> {
    const existingUser = await this.userRepository.findUserByNickname(nickname);
    if (existingUser) {
      throw new ConflictException('이미 사용 중인 닉네임입니다.');
    }
    user.nickname = nickname;
  }

  private async updateProfileImage(user, imageUrl: string): Promise<void> {
    if (imageUrl === ' ') {
      user.imageUrl = this.fileUploadService.getDefaultProfileImgURL(); // 기본 이미지로 설정
    } else {
      user.imageUrl = imageUrl; // 새 이미지 URL 설정
    }
  }

  private async updateHashtags(userId: number, hashtags: string[]): Promise<void> {
    const currentHashtagsSet = new Set(await this.userRepository.findHashtagsByUserId(userId)); // 기존 해시태그를 Set으로 변환
    const uniqueHashtagsSet = new Set(hashtags); // 새로운 해시태그 목록을 Set으로 변환

    const hashtagsToAdd = Array.from(uniqueHashtagsSet).filter((tag) => !currentHashtagsSet.has(tag)); // Set을 사용해 추가할 해시태그 필터링
    const hashtagsToRemove = Array.from(currentHashtagsSet).filter((tag) => !uniqueHashtagsSet.has(tag)); // Set을 사용해 삭제할 해시태그 필터링

    if (hashtagsToRemove.length > 0) {
      await this.userRepository.deleteHashtags(userId, hashtagsToRemove);
    }

    if (hashtagsToAdd.length > 0) {
      const userHashtagsToAdd = hashtagsToAdd.map((tag) => {
        const userHashtag = new UserHashtag();
        const user = new User();
        user.id = userId;
        userHashtag.user = user;
        userHashtag.name = tag;
        return userHashtag;
      });
      await this.userRepository.createHashtags(userHashtagsToAdd);
    }
  }

  async logout(userId: number): Promise<void> {
    const user = await this.userRepository.findUserById(userId);
    if (!user) {
      throw new NotFoundException('회원을 찾을 수 없습니다.');
    }

    user.refreshToken = null;
    await this.userRepository.updateUser(user);
  }

  async deleteUser(userId: number): Promise<void> {
    const user = await this.userRepository.findUserById(userId);
    if (!user) {
      throw new NotFoundException('회원을 찾을 수 없습니다.');
    }

    await this.userRepository.deleteUser(userId);
  }
}
