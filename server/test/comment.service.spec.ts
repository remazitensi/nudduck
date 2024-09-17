import { Test, TestingModule } from '@nestjs/testing';
import { CommunityService } from '../src/modules/community/community.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CommentRepository } from '../src/modules/community/repositories/comment.repository';
import { PostRepository } from '../src/modules/community/repositories/post.repository';
import { HttpException, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from '../src/modules/community/dto/create-comment.dto';
import { Comment } from '../src/modules/community/entities/comment.entity';

describe('CommunityService', () => {
  let service: CommunityService;
  let mockCommentRepository: any;
  let mockPostRepository: any;

  beforeEach(async () => {
    mockCommentRepository = {
      create: jest.fn(),
      save: jest.fn(),
      deleteCommentAndReplies: jest.fn(),
    };

    mockPostRepository = {
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [CommunityService, { provide: getRepositoryToken(CommentRepository), useValue: mockCommentRepository }, { provide: getRepositoryToken(PostRepository), useValue: mockPostRepository }],
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

      mockCommentRepository.deleteCommentAndReplies.mockResolvedValue({ affected: 1 });
      mockPostRepository.update.mockResolvedValue({ affected: 1 }); // 댓글 수 업데이트 성공

      await expect(service.deleteComment(postId, commentId)).resolves.not.toThrow();
    });

    it('should throw NotFoundException when comment does not exist', async () => {
      const postId = 1;
      const commentId = 1;

      mockCommentRepository.deleteCommentAndReplies.mockResolvedValue({ affected: 0 }); // 댓글 삭제 실패
      mockPostRepository.update.mockResolvedValue({ affected: 0 });

      await expect(service.deleteComment(postId, commentId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteReply', () => {
    it('should delete a reply', async () => {
      const postId = 1;
      const replyId = 2;

      mockCommentRepository.deleteCommentAndReplies.mockResolvedValue({ affected: 1 });

      await expect(service.deleteReply(postId, replyId)).resolves.not.toThrow();
    });

    it('should throw NotFoundException when reply does not exist', async () => {
      const postId = 1;
      const replyId = 2;

      mockCommentRepository.deleteCommentAndReplies.mockResolvedValue({ affected: 0 }); // 답글 삭제 실패

      await expect(service.deleteReply(postId, replyId)).rejects.toThrow(NotFoundException);
    });
  });
});
