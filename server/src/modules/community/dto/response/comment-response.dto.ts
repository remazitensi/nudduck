/**
 * File Name    : comment-response.dto.ts
 * Description  : 댓글 및 대댓글 응답 데이터 전송 객체 (DTO)
 * Author       : 김재영
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.21    김재영      Created     댓글 응답 DTO 초기 생성
 * 2024.09.22    김재영      Modified    생성자 추가 및 데이터 매핑 로직 추가
 * 2024.09.24    이승철      Modified    카멜케이스로 변경
 */

import { Comment } from '@_modules/community/entities/comment.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CommentResponseDto {
  @ApiPropertyOptional({
    description: '게시글 ID',
    example: 10,
  })
  postId?: number;

  @ApiProperty({
    description: '댓글 ID',
    example: 101,
  })
  commentId: number;

  @ApiProperty({
    description: '댓글 내용',
    example: '이 게시글에 대한 댓글입니다.',
  })
  content: string;

  @ApiProperty({
    description: '작성 일시',
    example: '2024-09-12T12:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: '수정 일시',
    example: '2024-09-12T12:05:00Z',
  })
  updatedAt: Date;

  @ApiPropertyOptional({
    description: '대댓글 수',
    example: 2,
  })
  replyCount?: number;

  @ApiPropertyOptional({
    description: '대댓글일 경우 부모 댓글의 ID',
    example: 1,
  })
  parentId?: number;

  @ApiProperty({
    description: '작성자 ID',
    example: 101,
  })
  userId: number;

  @ApiProperty({
    description: '작성자 닉네임',
    example: '멋쨍이째영',
  })
  nickname: string;

  @ApiPropertyOptional({
    description: '작성자 프로필 사진 URL',
    example: 'http://nudduck.com/remazitensi.jpg',
  })
  imageUrl?: string;

  constructor(comment: Comment, replyCount?: number) {
    this.postId = comment.postId; // 커뮤니티 ID
    this.commentId = comment.id; // 댓글 ID
    this.content = comment.content; // 댓글 내용
    this.createdAt = comment.createdAt; // 작성 일시
    this.updatedAt = comment.updatedAt; // 수정 일시
    this.replyCount = replyCount; // 대댓글 수
    this.parentId = comment.parentId; // 부모 댓글 ID
    this.userId = comment.user?.id || null;
    this.nickname = comment.user?.nickname || null; // 작성자 닉네임
    this.imageUrl = comment.user?.imageUrl || null; // 작성자 프로필 사진 URL
  }
}
