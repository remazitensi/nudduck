/**
 * File Name    : community.service.spec.ts
 * Description  : 커뮤니티 서비스 테스트
 * Author       : 김재영
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.13    김재영      Created     커뮤니티 서비스에 대한 테스트 케이스 작성
 */

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommunityService } from '../src/modules/community/community.service';
import { Community } from '../src/modules/community/entities/community.entity';
import { Comment } from '../src/modules/community/entities/comment.entity';
import { NotFoundException } from '@nestjs/common';
import { CreateCommunityDto } from '../src/modules/community/dto/create-community.dto';
import { UpdateCommunityDto } from '../src/modules/community/dto/update-community.dto';

describe('CommunityService', () => {
  let service: CommunityService;
  let repository: Repository<Community>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommunityService,
        {
          provide: getRepositoryToken(Community),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
            find: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Comment),
          useValue: {
            save: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CommunityService>(CommunityService);
    repository = module.get<Repository<Community>>(getRepositoryToken(Community));
  });

  // 게시글 생성 테스트
  it('should create a community post', async () => {
    const createCommunityDto: CreateCommunityDto = {
      title: 'Test Post',
      content: 'Test Content',
      user_id: 123,
    };
    const savedCommunity = {
      post_id: 1,
      ...createCommunityDto,
      likes_count: 0,
      views_count: 0,
      comments_count: 0,
      created_at: new Date(),
      updated_at: new Date(),
    };

    jest.spyOn(repository, 'create').mockReturnValue(savedCommunity as any);
    jest.spyOn(repository, 'save').mockResolvedValue(savedCommunity);

    const result = await service.create(createCommunityDto);
    expect(result).toEqual(savedCommunity);
  });

  // 특정 게시글 조회 테스트
  it('should fetch a post by id', async () => {
    const community = {
      post_id: 1,
      title: 'Test Post',
      content: 'Test Content',
      user_id: 123,
      created_at: new Date(),
      updated_at: new Date(),
      likes_count: 0,
      views_count: 0,
      comments_count: 0,
    };
    jest.spyOn(repository, 'findOne').mockResolvedValue(community);

    const result = await service.findOne(1);
    expect(result).toEqual(community);
  });

  // 게시글이 없을 때 에러 발생 테스트
  it('should throw an error if post is not found', async () => {
    jest.spyOn(repository, 'findOne').mockResolvedValue(null);

    await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
  });

  // 게시글 수정 테스트
  it('should update a community post', async () => {
    const updateCommunityDto: UpdateCommunityDto = { title: 'Updated Title', content: 'Updated Content' };
    const existingPost = {
      post_id: 1,
      title: 'Old Title',
      content: 'Old Content',
      user_id: 123,
      created_at: new Date(),
      updated_at: new Date(),
      likes_count: 0,
      views_count: 0,
      comments_count: 0,
    };
    const updatedPost = { ...existingPost, ...updateCommunityDto, updated_at: new Date() };

    jest.spyOn(service, 'findOne').mockResolvedValue(existingPost);
    jest.spyOn(repository, 'save').mockResolvedValue(updatedPost);

    const result = await service.update(1, updateCommunityDto);
    expect(result).toEqual(updatedPost);
  });

  // 게시글 삭제 테스트
  it('should delete a community post', async () => {
    const post = {
      post_id: 1,
      title: 'Test Post',
      content: 'Test Content',
      user_id: 123,
      created_at: new Date(),
      updated_at: new Date(),
      likes_count: 0,
      views_count: 0,
      comments_count: 0,
    };

    jest.spyOn(service, 'findOne').mockResolvedValue(post);
    jest.spyOn(repository, 'remove').mockResolvedValue(undefined);

    await service.remove(1);
    expect(repository.remove).toHaveBeenCalledWith(post);
  });

  // 모든 게시글 조회 테스트 (페이지네이션 포함)
  it('should fetch all posts with pagination', async () => {
    const posts = [
      {
        post_id: 1,
        title: 'Post 1',
        content: 'Content 1',
        user_id: 123,
        created_at: new Date(),
        updated_at: new Date(),
        likes_count: 0,
        views_count: 0,
        comments_count: 0,
      },
      {
        post_id: 2,
        title: 'Post 2',
        content: 'Content 2',
        user_id: 123,
        created_at: new Date(),
        updated_at: new Date(),
        likes_count: 0,
        views_count: 0,
        comments_count: 0,
      },
    ];
    jest.spyOn(repository, 'find').mockResolvedValue(posts);

    const result = await service.findAll({ page: 1, pageSize: 10 });
    expect(result).toEqual(posts);
  });

  // 좋아요 수 증가 테스트
  it('should increment likes count', async () => {
    const post = {
      post_id: 1,
      title: 'Test Post',
      content: 'Test Content',
      user_id: 123,
      created_at: new Date(),
      updated_at: new Date(),
      likes_count: 0,
      views_count: 0,
      comments_count: 0,
    };
    const updatedPost = { ...post, likes_count: 1 };

    jest.spyOn(service, 'findOne').mockResolvedValue(post);
    jest.spyOn(repository, 'save').mockResolvedValue(updatedPost);

    const result = await service.incrementLikes(1);
    expect(result.likes_count).toEqual(1);
  });

  // 좋아요 수 감소 테스트
  it('should decrement likes count', async () => {
    const post = {
      post_id: 1,
      title: 'Test Post',
      content: 'Test Content',
      user_id: 123,
      created_at: new Date(),
      updated_at: new Date(),
      likes_count: 1,
      views_count: 0,
      comments_count: 0,
    };
    const updatedPost = { ...post, likes_count: 0 };

    jest.spyOn(service, 'findOne').mockResolvedValue(post);
    jest.spyOn(repository, 'save').mockResolvedValue(updatedPost);

    const result = await service.decrementLikes(1);
    expect(result.likes_count).toEqual(0);
  });

  // 조회수 증가 테스트
  it('should increment views count', async () => {
    const post = {
      post_id: 1,
      title: 'Test Post',
      content: 'Test Content',
      user_id: 123,
      created_at: new Date(),
      updated_at: new Date(),
      likes_count: 0,
      views_count: 0,
      comments_count: 0,
    };
    const updatedPost = { ...post, views_count: 1 };

    jest.spyOn(service, 'findOne').mockResolvedValue(post);
    jest.spyOn(repository, 'save').mockResolvedValue(updatedPost);

    const result = await service.incrementViews(1);
    expect(result.views_count).toEqual(1);
  });
});
