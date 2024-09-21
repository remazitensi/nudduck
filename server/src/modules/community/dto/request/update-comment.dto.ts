/**
 * File Name    : update-comment.dto.ts
 * Description  : 댓글 및 대댓글 수정 데이터 전송 객체 (DTO)
 * Author       : 김재영
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.10    김재영      Created     댓글 수정 DTO 초기 생성
 * 2024.09.12    김재영      Modified    Swagger 데코레이터 추가
 * 2024.09.22    김재영      Modified    댓글 및 대댓글 수정 요청 데이터 통합
 */

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdateCommentDto {
  @ApiPropertyOptional({ description: '수정된 댓글 내용', example: '수정된 댓글입니다.' })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({
    description: '게시글 ID',
    example: 10,
  })
  @IsNumber()
  @IsOptional()
  postId?: number;

  @ApiPropertyOptional({
    description: '수정할 댓글의 ID',
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  commentId?: number;

  @ApiPropertyOptional({
    description: '대댓글일 경우 부모 댓글의 ID',
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  parentId?: number;
}
