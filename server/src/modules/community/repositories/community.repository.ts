import { Repository, QueryFailedError } from 'typeorm';
import { Community } from '@_modules/community/entities/community.entity';
import { PaginationQueryDto } from '@_modules/community/dto/request/pagination-query.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CommunityResponseDto } from '@_modules/community/dto/response/community-response.dto';
import { CreateCommunityDto } from '@_modules/community/dto/request/create-community.dto';
import { UpdateCommunityDto } from '@_modules/community/dto/request/update-community.dto';

export class CommunityRepository extends Repository<Community> {
  private buildPaginationQuery(paginationQuery: PaginationQueryDto) {
    const { page = 1, pageSize = 10, sort = 'createdAt:DESC' } = paginationQuery;
    const take = pageSize;
    const skip = (page - 1) * pageSize;

    const [sortField, sortOrder] = sort.split(':');
    const validSortFields = ['createdAt', 'viewCount'];

    if (!validSortFields.includes(sortField)) {
      throw new HttpException('유효하지 않은 정렬 필드입니다.', HttpStatus.BAD_REQUEST);
    }

    return { take, skip, sortField, sortOrder };
  }

  async findAll(paginationQuery: PaginationQueryDto): Promise<[CommunityResponseDto[], number]> {
    const { take, skip, sortField, sortOrder } = this.buildPaginationQuery(paginationQuery);

    try {
      const [posts, total] = await this.createQueryBuilder('community')
        .leftJoinAndSelect('community.user', 'user')
        .select(['community.postId', 'community.title', 'community.viewCount', 'community.createdAt', 'community.category', 'user.nickname', 'user.image_url'])
        .orderBy(`community.${sortField}`, sortOrder as 'ASC' | 'DESC')
        .take(take)
        .skip(skip)
        .getManyAndCount();

      const postsDto = posts.map((post) => new CommunityResponseDto(post));

      return [postsDto, total];
    } catch (error) {
      this.handleError(error);
    }
  }

  async findByCategory(category: string, paginationQuery: PaginationQueryDto): Promise<[CommunityResponseDto[], number]> {
    const { take, skip, sortField, sortOrder } = this.buildPaginationQuery(paginationQuery);

    try {
      const [posts, total] = await this.createQueryBuilder('community')
        .leftJoinAndSelect('community.user', 'user')
        .where('community.category = :category', { category })
        .select(['community.postId', 'community.title', 'community.viewCount', 'community.createdAt', 'community.category', 'user.nickname', 'user.image_url'])
        .orderBy(`community.${sortField}`, sortOrder as 'ASC' | 'DESC')
        .take(take)
        .skip(skip)
        .getManyAndCount();

      const postsDto = posts.map((post) => new CommunityResponseDto(post));

      return [postsDto, total];
    } catch (error) {
      this.handleError(error);
    }
  }

  async createPost(postData: CreateCommunityDto): Promise<Community> {
    const newPost = this.create({
      ...postData,
      user: { id: postData.userId }, // userId 추가
    });
    try {
      return await this.save(newPost);
    } catch (error) {
      this.handleError(error);
    }
  }

  async updatePost(id: number, updateData: UpdateCommunityDto): Promise<void> {
    try {
      await this.update(id, updateData);
    } catch (error) {
      this.handleError(error);
    }
  }

  async deletePost(id: number): Promise<void> {
    try {
      await this.delete(id);
    } catch (error) {
      this.handleError(error);
    }
  }

  async incrementViewCount(postId: number): Promise<void> {
    try {
      await this.increment({ postId }, 'viewCount', 1);
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: any): never {
    if (error instanceof QueryFailedError) {
      throw new HttpException('쿼리 오류 발생', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    throw new HttpException('서버 오류 발생', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
