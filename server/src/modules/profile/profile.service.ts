/**
 * File Name    : profile.service.ts
 * Description  : profile 서비스 로직
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.17    이승철      Created
 * 2024.09.17    이승철      Modified    인생그래프 즐겨찾기 함께 조회
 * 2024.09.21    이승철      Modified    즐겨찾기 설정한 인생그래프 데이터 전체 반환
 * 2024.09.23    이승철      Modified    UserProfileDto로 변경
 * 2024.09.24    이승철      Modified    카멜케이스로 변경
 */

import { LifeGraphRepository } from '@_modules/life-graph/life-graph.repository';
import { UserRepository } from '@_modules/user/user.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UserProfileDto } from './dto/user-profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly lifeGraphRepository: LifeGraphRepository,
  ) {}

  async getUserProfile(userId: number): Promise<UserProfileDto> {
    const user = await this.userRepository.findUserById(userId, ['favoriteLifeGraph', 'hashtags']);
    if (!user) {
      throw new NotFoundException('해당 유저를 찾을 수 없습니다.');
    }

    const hashtags = user.hashtags.map((hashtag) => hashtag.name);

    const favoriteLifeGraph = user.favoriteLifeGraph ? await this.lifeGraphRepository.findOneLifeGraph(user.favoriteLifeGraph.id, user.id, { relations: ['events'] }) : null;

    return {
      nickname: user.nickname,
      email: user.email,
      name: user.name,
      imageUrl: user.imageUrl,
      hashtags,
      favoriteLifeGraph,
    };
  }
}
