/**
 * File Name    : post.repository.ts
 * Description  : 커뮤니티 게시글 리포지토리
 * Author       : 김재영
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.17    김재영      Created     게시글 리포지토리 초기 생성
 * 2024.09.17    김재영      Modified    타입 정의 및 메소드 추가
 * 2024.09.19    김재영      Modified    페이지네이션 및 카테고리별 게시글 조회 메소드 추가
 */

import { Repository, QueryFailedError } from 'typeorm';
import { Community } from '../entities/community.entity';
import { Category } from '../enums/category.enum';
import { PaginationQueryDto } from '../dto/pagination-query.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

export class PostRepository extends Repository<Community> {
  // 페이지네이션을 포함한 모든 게시글 조회
  async findAll(paginationQuery: PaginationQueryDto): Promise<Community[]> {
    const { page = 1, pageSize = 10 } = paginationQuery;
    const take = pageSize;
    const skip = (page - 1) * pageSize;

    try {
      return await this.createQueryBuilder('community').orderBy('community.createdAt', 'DESC').take(take).skip(skip).getMany();
    } catch (error) {
      this.handleError(error);
    }
  }

  // 페이지네이션을 포함한 카테고리별 게시글 조회
  async findByCategory(category: Category, paginationQuery: PaginationQueryDto): Promise<Community[]> {
    const { page = 1, pageSize = 10 } = paginationQuery;
    const take = pageSize;
    const skip = (page - 1) * pageSize;

    try {
      return await this.createQueryBuilder('community').where('community.category = :category', { category }).orderBy('community.createdAt', 'DESC').take(take).skip(skip).getMany();
    } catch (error) {
      this.handleError(error);
    }
  }

  // 게시글 생성
  async createPost(postData: Partial<Community>): Promise<Community> {
    try {
      const post = this.create(postData);
      return await this.save(post);
    } catch (error) {
      this.handleError(error);
    }
  }

  // 게시글 조회
  async findPostById(id: number): Promise<Community | undefined> {
    try {
      return await this.createQueryBuilder('community').leftJoinAndSelect('community.user', 'user').where('community.postId = :postId', { postId: id }).getOne();
    } catch (error) {
      this.handleError(error);
    }
  }

  // 게시글 수정
  async updatePost(id: number, updateData: Partial<Community>): Promise<void> {
    try {
      await this.update(id, updateData);
    } catch (error) {
      this.handleError(error);
    }
  }

  // 게시글 삭제
  async deletePost(id: number): Promise<void> {
    try {
      await this.delete(id);
    } catch (error) {
      this.handleError(error);
    }
  }

  // 게시글의 좋아요 수 증가 메소드
  async incrementLikeCount(postId: number): Promise<void> {
    try {
      await this.createQueryBuilder()
        .update(Community)
        .set({ likeCount: () => 'likeCount + 1' })
        .where('postId = :postId', { postId })
        .execute();
    } catch (error) {
      this.handleError(error);
    }
  }

  // 게시글의 좋아요 수 감소 메소드
  async decrementLikeCount(postId: number): Promise<void> {
    try {
      await this.createQueryBuilder()
        .update(Community)
        .set({ likeCount: () => 'likeCount - 1' })
        .where('postId = :postId', { postId })
        .execute();
    } catch (error) {
      this.handleError(error);
    }
  }

  // 게시글의 조회 수 증가 메소드
  async incrementViewCount(postId: number): Promise<void> {
    try {
      await this.createQueryBuilder()
        .update(Community)
        .set({ viewCount: () => 'viewCount + 1' })
        .where('postId = :postId', { postId })
        .execute();
    } catch (error) {
      this.handleError(error);
    }
  }

  // 오류 처리 메소드
  private handleError(error: any): void {
    if (error instanceof QueryFailedError) {
      throw new HttpException('쿼리 오류 발생', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    // 기타 오류 처리
    throw new HttpException('서버 오류 발생', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
