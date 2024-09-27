/**
 * File Name    : createComment.dto.ts
 * Description  : 댓글 생성 데이터 전송 객체 (DTO)
 * Author       : 김재영
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.09    김재영      Created     댓글 생성 DTO 초기 생성
 * 2024.09.10    김재영      Modified    대댓글에 대한 parentId 속성 추가
 * 2024.09.12    김재영      Modified    Swagger 데코레이터 추가
 * 2024.09.16    김재영      Modified    camelcase로 변경
 * 2024.09.22    김재영      Modified    댓글 ID 추가
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    description: '댓글 내용',
    example: '이 게시글에 대한 댓글입니다.',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: '게시글 ID',
    example: 10,
  })
  @IsNumber()
  @IsNotEmpty()
  postId: number;

  @ApiPropertyOptional({
    description: '댓글 ID (대댓글이 아닌 경우 필요하지 않음)',
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
