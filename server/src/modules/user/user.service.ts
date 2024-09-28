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
 * 2024.09.24    이승철      Modified    가입일 반환
 * 2024.09.24    이승철      Modified    인생그래프 조회 인자 순서변경
 * 2024.09.27    이승철      Modified    프로필 조회 병렬처리
 * 2024.09.29    이승철      Modified    조회 에러처리 및 수정 read도 transaction에 포함
 */

import { FileUploadService } from '@_modules/file-upload/file-upload.service';
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
    private readonly fileUploadService: FileUploadService,
    private readonly dataSource: DataSource,
  ) {}

  async getMyProfileWithPosts(
    userId: number,
    myPaginationQueryDto: MyPaginationQueryDto
  ): Promise<MyProfileDto> {
    const { page, limit } = myPaginationQueryDto;
    const actualPage = Math.max(page, 1);
  
    // 유저 조회는 가장 중요한 작업이므로 별도로 처리
    const user = await this.userRepository.findUserById(userId, ['favoriteLifeGraph', 'hashtags']);
    if (!user) {
      throw new NotFoundException('회원을 찾을 수 없습니다.');
    }
  
    const [totalCountResult, postsResult, favoriteLifeGraphResult] = await Promise.allSettled([
      this.userRepository.countMyPosts(userId),
      this.userRepository.findMyPosts(userId, actualPage, limit),
      user.favoriteLifeGraph 
        ? this.userRepository.findFavoriteLifeGraph(user.id, user.favoriteLifeGraph.id, ['events'])
        : Promise.resolve(null),
    ]);
  
    // 다른 작업들은 실패해도 기본값을 설정
    const totalCount = totalCountResult.status === 'fulfilled' ? totalCountResult.value : 0;
    const posts = postsResult.status === 'fulfilled' ? postsResult.value : [];
    const favoriteLifeGraph = favoriteLifeGraphResult.status === 'fulfilled' ? favoriteLifeGraphResult.value : null;
  
    const hashtags = user.hashtags.map((hashtag) => hashtag.name);
    const postSummaries = posts.map((post) => new CommunitySummaryDto(post));
  
    const profile: MyProfileDto = {
      nickname: user.nickname,
      email: user.email,
      name: user.name,
      imageUrl: user.imageUrl,
      createdAt: user.createdAt,
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
      const user = await queryRunner.manager.findOne(User, { where: { id: userId }, relations: ['hashtags'] });
      if (!user) {
        throw new NotFoundException('회원을 찾을 수 없습니다.');
      }

      // 닉네임 유효성 검사 및 업데이트 (닉네임이 undefined가 아니고 기존과 다른 경우에만)
      if (updateProfileDto.nickname && user.nickname !== updateProfileDto.nickname) {
        await this.updateNickname(queryRunner, user, updateProfileDto.nickname);
      }

      // 프로필 이미지 수정/삭제 (imageUrl이 undefined가 아니고 기존과 다른 경우에만)
      if (updateProfileDto.imageUrl && user.imageUrl !== updateProfileDto.imageUrl) {
        await this.updateProfileImage(user, updateProfileDto.imageUrl);
      }

      // 해시태그 수정 (해시태그가 undefined가 아니고 기존과 다른 경우에만)
      if (updateProfileDto.hashtags && updateProfileDto.hashtags.length > 0) {
        await this.updateHashtags(queryRunner, userId, updateProfileDto.hashtags);
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

  private async updateNickname(queryRunner, user, nickname: string): Promise<void> {
    const existingUser = await queryRunner.manager.findOne(User, { where: { nickname } });
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

  private async updateHashtags(queryRunner, userId: number, hashtags: string[]): Promise<void> {
    const currentHashtagsSet = new Set<string>(await this.userRepository.findHashtagsByUserId(userId)); // Set<string>으로 명시
    const uniqueHashtagsSet = new Set<string>(hashtags); 
  
    const hashtagsToAdd = Array.from(uniqueHashtagsSet).filter((tag: string) => !currentHashtagsSet.has(tag));
    const hashtagsToRemove = Array.from(currentHashtagsSet).filter((tag: string) => !uniqueHashtagsSet.has(tag));
  
    if (hashtagsToRemove.length > 0) {
      await this.userRepository.deleteHashtags(userId, hashtagsToRemove); // 트랜잭션 내에서 해시태그 삭제
    }
  
    if (hashtagsToAdd.length > 0) {
      const userHashtagsToAdd = hashtagsToAdd.map((tag: string) => {
        const userHashtag = new UserHashtag();
        const user = new User();
        user.id = userId;
        userHashtag.user = user;
        userHashtag.name = tag;
        return userHashtag;
      });
      await this.userRepository.createHashtags(userHashtagsToAdd); // 트랜잭션 내에서 해시태그 추가
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
