/**
 * File Name    : profile.service.ts
 * Description  : profile 서비스 로직
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.17    이승철      Created
 */

import { Injectable, NotFoundException } from '@nestjs/common';
import { ProfileDto } from '@_modules/user/dto/profile.dto';
import { UserRepository } from '@_modules/user/user.repository';

@Injectable()
export class ProfileService {
  constructor(private readonly userRepository: UserRepository) {}

  async getUserProfile(userId: number): Promise<ProfileDto> {
    // 'favoriteLifeGraph'와 'hashtags'를 함께 조회
    const user = await this.userRepository.findUserById(userId, ['favoriteLifeGraph', 'hashtags']);
    if (!user) {
      throw new NotFoundException('해당 유저를 찾을 수 없습니다.');
    }

    const hashtags = user.hashtags.map((hashtag) => hashtag.name);

    return {
      nickname: user.nickname,
      email: user.email,
      name: user.name,
      imageUrl: user.image_url,
      hashtags,
      favoriteLifeGraph: user.favorite_life_graph,
    };
  }
}
