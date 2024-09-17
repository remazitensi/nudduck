/**
 * File Name    : post.repository.ts
 * Description  : 커뮤니티 게시글 리포지토리
 * Author       : 김재영
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.17    김재영      Created     게시글 리포지토리 초기 생성
 * 2024.09.17    김재영      Modified    타입 정의 및 메소드 추가
 */

import { Repository } from 'typeorm';
import { Community } from '../entities/community.entity';
import { Category } from '../enums/category.enum';

export class PostRepository extends Repository<Community> {
  // 카테고리로 게시글을 조회하는 메소드
  async findByCategory(category: Category, take: number, skip: number): Promise<Community[]> {
    return this.createQueryBuilder('community').where('community.category = :category', { category }).take(take).skip(skip).orderBy('community.createdAt', 'DESC').getMany();
  }

  // 게시글의 좋아요 수 증가 메소드
  async incrementLikeCount(postId: number): Promise<void> {
    await this.createQueryBuilder()
      .update(Community)
      .set({ likeCount: () => 'likeCount + 1' })
      .where('postId = :postId', { postId })
      .execute();
  }

  // 게시글의 좋아요 수 감소 메소드
  async decrementLikeCount(postId: number): Promise<void> {
    await this.createQueryBuilder()
      .update(Community)
      .set({ likeCount: () => 'likeCount - 1' })
      .where('postId = :postId', { postId })
      .execute();
  }

  // 게시글의 조회 수 증가 메소드
  async incrementViewCount(postId: number): Promise<void> {
    await this.createQueryBuilder()
      .update(Community)
      .set({ viewCount: () => 'viewCount + 1' })
      .where('postId = :postId', { postId })
      .execute();
  }
}
