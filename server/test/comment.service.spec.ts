/**
 * File Name    : comment.service.spec.ts
 * Description  : 댓글 및 대댓글에 대한 유닛 테스트
 * Author       : 김재영
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.13    김재영      Created     댓글과 대댓글에 대한 유닛 테스트 케이스 작성
 * 2024.09.18    김재영      Modified    댓글 삭제 및 대댓글 삭제 관련 트랜잭션 처리 로직 추가 및 예외 처리 수정
 */

import { Test, TestingModule } from '@nestjs/testing';
import { CommunityService } from '../src/modules/community/community.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CommentRepository } from '../src/modules/community/repositories/comment.repository';
import { PostRepository } from '../src/modules/community/repositories/post.repository';
import { DataSource } from 'typeorm';
import { HttpException, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from '../src/modules/community/dto/create-comment.dto';
import { Comment } from '../src/modules/community/entities/comment.entity';

describe('CommunityService', () => {
  let service: CommunityService;
  let mockCommentRepository: any;
  let mockPostRepository: any;
  let mockDataSource: any;

  beforeEach(async () => {
    mockCommentRepository = {
      create: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      findWithReplies: jest.fn(),
    };

    mockPostRepository = {
      update: jest.fn(),
      findOneBy: jest.fn(),
    };

    mockDataSource = {
      transaction: jest.fn().mockImplementation(async (callback) => {
        const manager = {
          delete: jest.fn(),
          save: jest.fn(),
          count: jest.fn(),
          findOne: jest.fn(),
          update: jest.fn(),
        };
        return await callback(manager);
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommunityService,
        { provide: getRepositoryToken(CommentRepository), useValue: mockCommentRepository },
        { provide: getRepositoryToken(PostRepository), useValue: mockPostRepository },
        { provide: DataSource, useValue: mockDataSource },
      ],
    }).compile();

    service = module.get<CommunityService>(CommunityService);
  });

  describe('createComment', () => {
    it('should create and return a comment', async () => {
      const createCommentDto: CreateCommentDto = { content: 'Test Comment', postId: 1, userId: 1 };
      const comment = { ...createCommentDto, id: 1, createdAt: new Date(), updatedAt: new Date() } as unknown as Comment;

      mockCommentRepository.create.mockReturnValue(comment);
      mockCommentRepository.save.mockResolvedValue(comment);
      mockPostRepository.update.mockResolvedValue({ affected: 1 }); // 댓글 수 업데이트 성공

      const result = await service.createComment(createCommentDto.postId, createCommentDto);

      expect(result).toEqual(comment);
    });

    it('should throw HttpException if post comment count update fails', async () => {
      const createCommentDto: CreateCommentDto = { content: 'Test Comment', postId: 1, userId: 1 };

      mockCommentRepository.create.mockReturnValue({});
      mockCommentRepository.save.mockResolvedValue({});
      mockPostRepository.update.mockResolvedValue({ affected: 0 }); // 댓글 수 업데이트 실패

      await expect(service.createComment(createCommentDto.postId, createCommentDto)).rejects.toThrow(HttpException);
    });
  });

  describe('deleteComment', () => {
    it('should delete a comment', async () => {
      const postId = 1;
      const commentId = 1;

      mockDataSource.transaction.mockImplementationOnce(async (callback) => {
        const manager = {
          delete: jest.fn().mockResolvedValue({ affected: 1 }), // 댓글 삭제 성공
          update: jest.fn().mockResolvedValue({ affected: 1 }), // 댓글 수 업데이트 성공
        };
        return await callback(manager);
      });

      await expect(service.deleteComment(postId, commentId)).resolves.not.toThrow();
    });

    it('should throw NotFoundException when comment does not exist', async () => {
      const postId = 1;
      const commentId = 1;

      mockDataSource.transaction.mockImplementationOnce(async (callback) => {
        const manager = {
          delete: jest.fn().mockResolvedValue({ affected: 0 }), // 댓글 삭제 실패
          update: jest.fn().mockResolvedValue({ affected: 0 }), // 댓글 수 업데이트 실패
        };
        return await callback(manager);
      });

      await expect(service.deleteComment(postId, commentId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteReply', () => {
    it('should delete a reply', async () => {
      const postId = 1;
      const replyId = 2;

      mockDataSource.transaction.mockImplementationOnce(async (callback) => {
        const manager = {
          delete: jest.fn().mockResolvedValue({ affected: 1 }), // 답글 삭제 성공
        };
        return await callback(manager);
      });

      await expect(service.deleteReply(postId, replyId)).resolves.not.toThrow();
    });

    it('should throw NotFoundException when reply does not exist', async () => {
      const postId = 1;
      const replyId = 2;

      mockDataSource.transaction.mockImplementationOnce(async (callback) => {
        const manager = {
          delete: jest.fn().mockResolvedValue({ affected: 0 }), // 답글 삭제 실패
        };
        return await callback(manager);
      });

      await expect(service.deleteReply(postId, replyId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getReplies', () => {
    it('should return replies for a comment', async () => {
      const postId = 1;
      const commentId = 1;
      const replies = [{ id: 2, content: 'Reply', createdAt: new Date(), updatedAt: new Date() } as unknown as Comment];

      mockCommentRepository.findWithReplies.mockResolvedValue({ replies });

      const result = await service.getReplies(postId, commentId);

      expect(result).toEqual(replies);
    });

    it('should throw NotFoundException if comment does not exist', async () => {
      const postId = 1;
      const commentId = 1;

      mockCommentRepository.findWithReplies.mockResolvedValue(null);

      await expect(service.getReplies(postId, commentId)).rejects.toThrow(NotFoundException);
    });
  });
});
