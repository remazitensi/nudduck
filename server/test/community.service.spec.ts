import { Test, TestingModule } from '@nestjs/testing';
import { CommunityService } from '../src/modules/community/community.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CommentRepository } from '../src/modules/community/repositories/comment.repository';
import { PostRepository } from '../src/modules/community/repositories/post.repository';
import { HttpException, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from '../src/modules/community/dto/create-comment.dto';
import { UpdateCommentDto } from '../src/modules/community/dto/update-comment.dto';
import { Comment } from '../src/modules/community/entities/comment.entity';

describe('CommunityService - Comment Methods', () => {
  let service: CommunityService;
  let mockCommentRepository;
  let mockPostRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommunityService,
        {
          provide: getRepositoryToken(CommentRepository),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findWithReplies: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(PostRepository),
          useValue: {
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CommunityService>(CommunityService);
    mockCommentRepository = module.get(getRepositoryToken(CommentRepository));
    mockPostRepository = module.get(getRepositoryToken(PostRepository));
  });

  describe('createComment', () => {
    it('댓글 생성 및 저장', async () => {
      const createCommentDto: CreateCommentDto = {
        postId: 1,
        userId: 1,
        content: 'Test Comment',
      };
      const comment = new Comment();
      comment.postId = createCommentDto.postId;
      comment.userId = createCommentDto.userId;
      comment.content = createCommentDto.content;

      mockCommentRepository.create.mockReturnValue(comment);
      mockCommentRepository.save.mockResolvedValue(comment);
      mockPostRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.createComment(createCommentDto.postId, createCommentDto);
      expect(result).toEqual(comment);
    });

    it('댓글 생성 중 서버 오류 발생', async () => {
      const createCommentDto: CreateCommentDto = {
        postId: 1,
        userId: 1,
        content: 'Test Comment',
      };

      mockPostRepository.update.mockImplementation(() => {
        throw new Error('서버 오류');
      });

      await expect(service.createComment(createCommentDto.postId, createCommentDto)).rejects.toThrow(new HttpException('게시글 댓글 수 업데이트 중 서버 오류가 발생했습니다.', 500));
    });
  });

  describe('updateComment', () => {
    it('댓글 수정 및 반환', async () => {
      const updateCommentDto: UpdateCommentDto = { content: 'Updated Comment' };
      const postId = 1;
      const commentId = 1;
      const comment = new Comment();
      comment.postId = postId;
      comment.commentId = commentId;
      comment.content = 'Original Comment';

      const updatedComment = { ...comment, ...updateCommentDto };

      mockCommentRepository.findOne.mockResolvedValue(comment);
      mockCommentRepository.update.mockResolvedValue(updatedComment);

      const result = await service.updateComment(postId, commentId, updateCommentDto);
      expect(result).toEqual(updatedComment);
    });

    it('댓글 수정 중 서버 오류 발생', async () => {
      const postId = 1;
      const commentId = 1;
      const updateCommentDto: UpdateCommentDto = { content: 'Updated Comment' };

      mockCommentRepository.update.mockRejectedValue(new Error('서버 오류'));

      await expect(service.updateComment(postId, commentId, updateCommentDto)).rejects.toThrow(new HttpException('댓글 수정 중 오류가 발생했습니다.', 500));
    });
  });

  describe('deleteComment', () => {
    it('댓글 및 대댓글 삭제', async () => {
      const postId = 1;
      const commentId = 1;

      mockCommentRepository.delete.mockResolvedValue({ affected: 1 });
      mockPostRepository.update.mockResolvedValue({ affected: 1 });

      await expect(service.deleteComment(postId, commentId)).resolves.not.toThrow();
    });

    it('댓글 미존재시 오류 발생', async () => {
      const postId = 1;
      const commentId = 1;

      mockCommentRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.deleteComment(postId, commentId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getReplies', () => {
    it('댓글에 대한 대댓글 목록 조회', async () => {
      const postId = 1;
      const commentId = 1;
      const replies = [
        {
          commentId: 1,
          postId,
          content: 'Test Reply',
          userId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockCommentRepository.findWithReplies.mockResolvedValue(replies);

      const result = await service.getReplies(postId, commentId);
      expect(result).toEqual(replies);
    });

    it('댓글 미존재시 오류 발생', async () => {
      const postId = 1;
      const commentId = 1;

      mockCommentRepository.findWithReplies.mockResolvedValue([]);

      await expect(service.getReplies(postId, commentId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('createReply', () => {
    it('대댓글 생성 및 저장', async () => {
      const postId = 1;
      const parentId = 2; // 부모 댓글 ID 추가
      const createCommentDto: CreateCommentDto = {
        postId,
        userId: 1,
        content: 'Test Reply',
      };
      const reply = new Comment();
      reply.postId = createCommentDto.postId;
      reply.userId = createCommentDto.userId;
      reply.content = createCommentDto.content;

      mockCommentRepository.create.mockReturnValue(reply);
      mockCommentRepository.save.mockResolvedValue(reply);

      const result = await service.createReply(postId, parentId, createCommentDto); // parentId 추가
      expect(result).toEqual(reply);
    });

    it('대댓글 생성 중 서버 오류 발생', async () => {
      const postId = 1;
      const parentId = 2;
      const createCommentDto: CreateCommentDto = {
        postId,
        userId: 1,
        content: 'Test Reply',
      };

      mockCommentRepository.save.mockRejectedValue(new Error('서버 오류'));

      await expect(service.createReply(postId, parentId, createCommentDto)).rejects.toThrow(new HttpException('대댓글 생성 중 오류가 발생했습니다.', 500));
    });
  });

  describe('updateReply', () => {
    it('대댓글 수정 및 반환', async () => {
      const updateCommentDto: UpdateCommentDto = { content: 'Updated Reply' };
      const postId = 1;
      const replyId = 1;
      const reply = new Comment();
      reply.postId = postId;
      reply.commentId = replyId;
      reply.content = 'Original Reply';

      const updatedReply = { ...reply, ...updateCommentDto };

      mockCommentRepository.findOne.mockResolvedValue(reply);
      mockCommentRepository.update.mockResolvedValue(updatedReply);

      const result = await service.updateReply(postId, replyId, updateCommentDto);
      expect(result).toEqual(updatedReply);
    });

    it('대댓글 수정 중 서버 오류 발생', async () => {
      const postId = 1;
      const replyId = 1;
      const updateCommentDto: UpdateCommentDto = { content: 'Updated Reply' };

      mockCommentRepository.update.mockRejectedValue(new Error('서버 오류'));

      await expect(service.updateReply(postId, replyId, updateCommentDto)).rejects.toThrow(new HttpException('대댓글 수정 중 오류가 발생했습니다.', 500));
    });
  });

  describe('deleteReply', () => {
    it('대댓글 삭제', async () => {
      const postId = 1;
      const replyId = 1;

      mockCommentRepository.delete.mockResolvedValue({ affected: 1 });

      await expect(service.deleteReply(postId, replyId)).resolves.not.toThrow();
    });

    it('대댓글 미존재시 오류 발생', async () => {
      const postId = 1;
      const replyId = 1;

      mockCommentRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.deleteReply(postId, replyId)).rejects.toThrow(NotFoundException);
    });
  });
});
