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
