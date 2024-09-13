/**
 * File Name    : comment.service.spec.ts
 * Description  : 댓글 및 대댓글에 대한 유닛 테스트
 * Author       : 김재영
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.13    김재영      Created     댓글과 대댓글에 대한 유닛 테스트 케이스 작성
 */

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommunityService } from '../src/modules/community/community.service';
import { Comment } from '../src/modules/community/entities/comment.entity';
import { Community } from '../src/modules/community/entities/community.entity';
import { NotFoundException } from '@nestjs/common';

describe('CommunityService', () => {
  let service: CommunityService;
  let commentRepository: Repository<Comment>;
  let communityRepository: Repository<Community>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommunityService,
        {
          provide: getRepositoryToken(Comment),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Community),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<CommunityService>(CommunityService);
    commentRepository = module.get<Repository<Comment>>(getRepositoryToken(Comment));
    communityRepository = module.get<Repository<Community>>(getRepositoryToken(Community));
  });

  // 댓글 추가 테스트
  it('should add a comment to a post', async () => {
    const createCommentDto = { content: 'Test Comment', user_id: 1 };
    const savedComment: Comment = {
      comment_id: 1,
      content: 'Test Comment',
      post_id: 1,
      user_id: 1,
      created_at: new Date(),
      updated_at: new Date(),
      community: null, // Adjust if needed
      parent: null, // Adjust if needed
      replies: [], // Adjust if needed
    };

    jest.spyOn(commentRepository, 'create').mockReturnValue(savedComment as any);
    jest.spyOn(commentRepository, 'save').mockResolvedValue(savedComment);

    jest.spyOn(communityRepository, 'findOne').mockResolvedValue({ post_id: 1, comments_count: 0 } as any);
    jest.spyOn(communityRepository, 'save').mockResolvedValue({ post_id: 1, comments_count: 1 } as any);

    const result = await service.addComment(1, createCommentDto);
    expect(result).toEqual(savedComment);
  });

  // 댓글 추가 시 존재하지 않는 게시글에 댓글을 추가하려고 할 때 에러 발생 테스트
  it('should throw error when trying to add a comment to a non-existent post', async () => {
    jest.spyOn(communityRepository, 'findOne').mockResolvedValue(null);

    const createCommentDto = { content: 'Test Comment', user_id: 1 };

    await expect(service.addComment(999, createCommentDto)).rejects.toThrow(NotFoundException);
  });

  // 댓글 조회 테스트
  it('should fetch comments for a post', async () => {
    const comments: Comment[] = [
      {
        comment_id: 1,
        content: 'Comment 1',
        post_id: 1,
        user_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
        community: null, // Adjust if needed
        parent: null, // Adjust if needed
        replies: [], // Adjust if needed
      },
      {
        comment_id: 2,
        content: 'Comment 2',
        post_id: 1,
        user_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
        community: null, // Adjust if needed
        parent: null, // Adjust if needed
        replies: [], // Adjust if needed
      },
    ];
    jest.spyOn(commentRepository, 'find').mockResolvedValue(comments);

    const result = await service.getCommentsByPostId(1);
    expect(result).toEqual(comments);
  });

  // 대댓글 조회 테스트
  it('should fetch replies for a comment', async () => {
    const replies: Comment[] = [
      {
        comment_id: 2,
        content: 'Reply 1',
        parent_id: 1,
        post_id: 1,
        user_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
        community: null, // Adjust if needed
        parent: null, // Adjust if needed
        replies: [], // Adjust if needed
      },
      {
        comment_id: 3,
        content: 'Reply 2',
        parent_id: 1,
        post_id: 1,
        user_id: 3,
        created_at: new Date(),
        updated_at: new Date(),
        community: null, // Adjust if needed
        parent: null, // Adjust if needed
        replies: [], // Adjust if needed
      },
    ];
    jest.spyOn(commentRepository, 'find').mockResolvedValue(replies);

    const result = await service.getReplies(1, 1);
    expect(result).toEqual(replies);
  });

  // 댓글 삭제 테스트
  it('should delete a comment and update post comments count', async () => {
    const comment: Comment = {
      comment_id: 1,
      content: 'Test Comment',
      post_id: 1,
      user_id: 1,
      created_at: new Date(),
      updated_at: new Date(),
      community: null, // Adjust if needed
      parent: null, // Adjust if needed
      replies: [], // Adjust if needed
    };

    jest.spyOn(commentRepository, 'findOne').mockResolvedValue(comment);
    jest.spyOn(commentRepository, 'remove').mockResolvedValue(undefined);

    jest.spyOn(communityRepository, 'findOne').mockResolvedValue({ post_id: 1, comments_count: 1 } as any);
    jest.spyOn(communityRepository, 'save').mockResolvedValue({ post_id: 1, comments_count: 0 } as any);

    await service.deleteComment(1, 1);
    expect(commentRepository.remove).toHaveBeenCalledWith(comment);
  });
});
