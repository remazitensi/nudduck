/**
 * File Name    : community.service.ts
 * Description  : 커뮤니티 서비스
 * Author       : 김재영
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.07    김재영      Created     커뮤니티 서비스 초기 생성
 * 2024.09.09    김재영      Modified    게시글 CRUD 메서드 구현
 * 2024.09.10    김재영      Modified    댓글 관련 API 메서드 추가
 * 2024.09.10    김재영      Modified    TypeORM을 통한 데이터베이스 작업 처리 추가
 * 2024.09.11    김재영      Modified    페이지네이션 기능 추가 및 개선
 * 2024.09.12    김재영      Modified    게시글과 댓글의 대댓글 처리 로직 추가 및 리팩토링
 * 2024.09.12    김재영      Modified    좋아요 및 조회수 기능 추가
 * 2024.09.14    김재영      Modified    트랜잭션 및 query builder 적용
 */

import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Community } from './entities/community.entity';
import { Comment } from './entities/comment.entity';
import { Category } from './enums/category.enum';
import { CreateCommunityDto } from './dto/create-community.dto';
import { UpdateCommunityDto } from './dto/update-community.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';

@Injectable()
export class CommunityService {
  constructor(
    @InjectRepository(Community)
    private communityRepository: Repository<Community>,
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    private dataSource: DataSource,
  ) {}

  // 전체 게시글 조회 (페이지네이션 적용)
  async findAll(paginationQuery: PaginationQueryDto): Promise<Community[]> {
    try {
      const { page = 1, pageSize = 10 } = paginationQuery;
      const skip = (page - 1) * pageSize;

      return await this.communityRepository
        .createQueryBuilder('community')
        .leftJoinAndSelect('community.comments', 'comments')
        .skip(skip)
        .take(pageSize)
        .getMany();
    } catch (error) {
      throw new InternalServerErrorException('게시글 조회 중 오류가 발생했습니다.');
    }
  }

  // 특정 게시글 조회
  async findOne(id: number): Promise<Community> {
    try {
      const post = await this.communityRepository
        .createQueryBuilder('community')
        .leftJoinAndSelect('community.comments', 'comments')
        .where('community.postId = :id', { id })
        .getOne();

      if (!post) {
        throw new NotFoundException(`게시글 ${id}를 찾을 수 없습니다.`);
      }
      return post;
    } catch (error) {
      throw new InternalServerErrorException('게시글 조회 중 오류가 발생했습니다.');
    }
  }

  // 카테고리별 게시글 조회 (페이지네이션 적용)
  async findByCategory(category: Category, paginationQuery: PaginationQueryDto): Promise<Community[]> {
    try {
      const { page = 1, pageSize = 10 } = paginationQuery;
      const skip = (page - 1) * pageSize;

      return await this.communityRepository
        .createQueryBuilder('community')
        .leftJoinAndSelect('community.comments', 'comments')
        .where('community.category = :category', { category })
        .skip(skip)
        .take(pageSize)
        .getMany();
    } catch (error) {
      throw new InternalServerErrorException('카테고리별 게시글 조회 중 오류가 발생했습니다.');
    }
  }

  // 게시글 생성 (트랜잭션 사용)
  async create(createCommunityDto: CreateCommunityDto): Promise<Community> {
    try {
      return await this.dataSource.transaction(async (manager) => {
        const newPost = manager.create(Community, {
          ...createCommunityDto,
          createdAt: new Date(),
          updatedAt: new Date(),
          likeCount: 0,
          viewCount: 0,
          commentCount: 0,
        });
        return await manager.save(newPost);
      });
    } catch (error) {
      throw new InternalServerErrorException('게시글 생성 중 오류가 발생했습니다.');
    }
  }

  // 게시글 수정
  async update(postId: number, updateCommunityDto: UpdateCommunityDto): Promise<void> {
    try {
      await this.dataSource.transaction(async (manager) => {
        const result = await manager.update(Community, postId, {
          ...updateCommunityDto,
          updatedAt: new Date(),
        });

        if (result.affected === 0) {
          throw new NotFoundException(`게시글 ${postId}를 찾을 수 없습니다.`);
        }
      });
    } catch (error) {
      throw new InternalServerErrorException('게시글 수정 중 오류가 발생했습니다.');
    }
  }

  // 게시글 삭제
  async remove(id: number): Promise<void> {
    try {
      await this.dataSource.transaction(async (manager) => {
        const result = await manager.delete(Community, id);
        if (result.affected === 0) {
          throw new NotFoundException(`게시글 ${id}를 찾을 수 없습니다.`);
        }
      });
    } catch (error) {
      throw new InternalServerErrorException('게시글 삭제 중 오류가 발생했습니다.');
    }
  }

  // 댓글 작성
  async addComment(postId: number, createCommentDto: CreateCommentDto): Promise<Comment> {
    try {
      return await this.dataSource.transaction(async (manager) => {
        const post = await this.findOne(postId);

        const newComment = manager.create(Comment, {
          ...createCommentDto,
          postId: postId,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        const savedComment = await manager.save(newComment);

        post.commentCount++;
        await manager.save(post);

        return savedComment;
      });
    } catch (error) {
      throw new InternalServerErrorException('댓글 작성 중 오류가 발생했습니다.');
    }
  }

  // 댓글 수정
  async updateComment(postId: number, commentId: number, updateCommentDto: UpdateCommentDto): Promise<void> {
    try {
      await this.dataSource.transaction(async (manager) => {
        const result = await manager.update(
          Comment,
          { commentId, postId },
          {
            ...updateCommentDto,
            updatedAt: new Date(),
          },
        );

        if (result.affected === 0) {
          throw new NotFoundException(`댓글 ${commentId}를 찾을 수 없습니다.`);
        }
      });
    } catch (error) {
      throw new InternalServerErrorException('댓글 수정 중 오류가 발생했습니다.');
    }
  }

  // 댓글 삭제
  async deleteComment(postId: number, commentId: number): Promise<void> {
    try {
      await this.dataSource.transaction(async (manager) => {
        const result = await manager.delete(Comment, { commentId, postId });
        if (result.affected === 0) {
          throw new NotFoundException(`댓글 ${commentId}를 찾을 수 없습니다.`);
        }

        const post = await this.communityRepository.findOne({ where: { postId } });
        if (post) {
          post.commentCount--;
          await manager.save(post);
        }
      });
    } catch (error) {
      throw new InternalServerErrorException('댓글 삭제 중 오류가 발생했습니다.');
    }
  }

  // 좋아요 수 증가
  async likePost(id: number): Promise<void> {
    try {
      await this.dataSource.transaction(async (manager) => {
        const post = await this.findOne(id);
        post.likeCount++;
        await manager.save(post);
      });
    } catch (error) {
      throw new InternalServerErrorException('좋아요 처리 중 오류가 발생했습니다.');
    }
  }

  // 조회수 증가
  async increaseViewCount(id: number): Promise<void> {
    try {
      await this.dataSource.transaction(async (manager) => {
        const post = await this.findOne(id);
        post.viewCount++;
        await manager.save(post);
      });
    } catch (error) {
      throw new InternalServerErrorException('조회수 증가 처리 중 오류가 발생했습니다.');
    }
  }
}
