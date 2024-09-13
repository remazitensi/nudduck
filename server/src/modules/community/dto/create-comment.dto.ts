/**
 * File Name    : create-comment.dto.ts
 * Description  : 댓글 생성 데이터 전송 객체 (DTO)
 * Author       : 김재영
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.09    김재영      Created     댓글 생성 DTO 초기 생성
 * 2024.09.10    김재영      Modified    대댓글에 대한 parent_id 속성 추가
 * 2024.09.12    김재영      Modified    Swagger 데코레이터 추가
 */

import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({
    description: '댓글 내용',
    example: '이 게시글에 대한 댓글입니다.',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({
    description: '대댓글일 경우 부모 댓글의 ID',
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  parent_id?: number; // 대댓글일 경우, 부모 댓글 ID
}

// 조회 시 사용할 DTO
export class CommentResponseDto {
  @ApiProperty({
    description: '댓글 ID',
    example: 101,
  })
  comment_id: number;

  @ApiProperty({
    description: '댓글 내용',
    example: '이 게시글에 대한 댓글입니다.',
  })
  content: string;

  @ApiProperty({
    description: '작성 일시',
    example: '2024-09-12T12:00:00Z',
  })
  created_at: Date;

  @ApiProperty({
    description: '수정 일시',
    example: '2024-09-12T12:05:00Z',
  })
  updated_at: Date;

  @ApiProperty({
    description: '대댓글 수',
    example: 2,
  })
  repliesCount: number;
}
