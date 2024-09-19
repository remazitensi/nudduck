/**
 * File Name    : update-comment.dto.ts
 * Description  : 댓글 수정 데이터 전송 객체 (DTO)
 * Author       : 김재영
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.10    김재영      Created     댓글 수정 DTO 초기 생성
 * 2024.09.12    김재영      Modified    Swagger 데코레이터 추가
 * 2024.09.17    김재영      Modified    postId와 userId 속성 추가
 */

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdateCommentDto {
  @ApiPropertyOptional({ description: '댓글의 수정된 내용', example: '수정된 댓글입니다.' })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({
    description: '게시글 ID',
    example: 10,
  })
  @IsNumber()
  @IsOptional()
  postId?: number; // 게시글 ID 추가

  @ApiPropertyOptional({
    description: '작성자 ID',
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  userId?: number; // 작성자 ID 추가
}
