import { CreateCommunityDto } from '@_modules/community/dto/request/create-community.dto';
import { PaginationQueryDto } from '@_modules/community/dto/request/pagination-query.dto';
import { UpdateCommunityDto } from '@_modules/community/dto/request/update-community.dto';
import { CommunityResponseDto } from '@_modules/community/dto/response/community-response.dto';
import { Community } from '@_modules/community/entities/community.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DataSource, QueryFailedError, Repository } from 'typeorm';
import { Category } from '../enums/category.enum';

@Injectable()
export class CommunityRepository extends Repository<Community> {
  constructor(dataSource: DataSource) {
    super(Community, dataSource.createEntityManager());
  }

  // 커뮤니티 페이징 쿼리 빌드 함수
  private buildCommunityPaginationQuery(paginationQuery: PaginationQueryDto) {
    const page = paginationQuery.page || 1;
    const pageSize = paginationQuery.pageSize || 10;
    const sort = paginationQuery.sort || 'createdAt:desc'; // 기본값 설정

    // 정렬 필드와 순서를 추출
    const [sortField, sortOrder] = sort.split(':');
    const validSortFields = ['createdAt', 'viewCount'];
    const validSortOrders = ['asc', 'desc'];

    // 유효성 검사
    if (!validSortFields.includes(sortField)) {
      throw new HttpException(`유효하지 않은 정렬 필드입니다: ${sortField}`, HttpStatus.BAD_REQUEST);
    }
    if (!validSortOrders.includes(sortOrder.toLowerCase())) {
      throw new HttpException(`유효하지 않은 정렬 순서입니다: ${sortOrder}`, HttpStatus.BAD_REQUEST);
    }

    const skip = (page - 1) * pageSize;
    return { take: pageSize, skip, sortField, sortOrder: sortOrder.toUpperCase() };
  }

  // 전체 게시글 조회 함수
  async findAll(paginationQuery: PaginationQueryDto): Promise<[CommunityResponseDto[], number]> {
    const { take, skip, sortField, sortOrder } = this.buildCommunityPaginationQuery(paginationQuery);

    try {
      const [posts, total] = await this.createQueryBuilder('community')
        .leftJoinAndSelect('community.user', 'user')
        .select(['community.postId', 'community.title', 'community.viewCount', 'community.createdAt', 'community.category', 'user.id', 'user.nickname', 'user.imageUrl'])
        .orderBy(`community.${sortField}`, sortOrder as 'ASC' | 'DESC')
        .take(take)
        .skip(skip)
        .getManyAndCount();

      const postsDto = posts.map((post) => new CommunityResponseDto(post));

      return [postsDto, total];
    } catch (error) {
      throw new HttpException(`게시글 조회 중 오류 발생: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // 카테고리별 게시글 조회 함수
  async findByCategory(category: Category, paginationQuery: PaginationQueryDto): Promise<[CommunityResponseDto[], number]> {
    const { take, skip, sortField, sortOrder } = this.buildCommunityPaginationQuery(paginationQuery);

    try {
      const [posts, total] = await this.createQueryBuilder('community')
        .leftJoinAndSelect('community.user', 'user')
        .where('community.category = :category', { category })
        .select(['community.postId', 'community.title', 'community.viewCount', 'community.createdAt', 'community.category', 'user.id', 'user.nickname', 'user.imageUrl'])
        .orderBy(`community.${sortField}`, sortOrder as 'ASC' | 'DESC') // sortOrder를 타입으로 변환
        .take(take)
        .skip(skip)
        .getManyAndCount();

      const postsDto = posts.map((post) => new CommunityResponseDto(post));

      return [postsDto, total];
    } catch (error) {
      throw new HttpException(`카테고리별 게시글 조회 중 오류 발생: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async createPost(postData: CreateCommunityDto, userId: number): Promise<Community> {
    const newPost = this.create({
      ...postData,
      user: { id: userId }, // userId를 사용하여 작성자 설정
    });

    try {
      const savedPost = await this.save(newPost);
      return savedPost;
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
    console.error('Error in handleError:', error);
    throw new HttpException('서버 오류 발생', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
