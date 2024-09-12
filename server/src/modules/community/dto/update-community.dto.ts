/**
 * File Name    : update-community.dto.ts
 * Description  : 커뮤니티 업데이트 DTO
 * Author       : 김재영
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.07    김재영      Created
 * 2024.09.09    김재영      Modified    필드 추가
 * 2024.09.12    김재영      Modified    Swagger 데코레이터 추가
 */

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsNumber } from 'class-validator';
import { Category } from '../enums/category.enum';

export class UpdateCommunityDto {
  @ApiPropertyOptional({ description: '수정된 게시글 제목' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: '수정된 게시글 내용' })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({
    description: '수정된 게시글 카테고리',
    enum: Category,
  })
  @IsOptional()
  @IsEnum(Category)
  category?: Category;

  @ApiPropertyOptional({ description: '수정된 좋아요 수' })
  @IsOptional()
  @IsNumber()
  likes_count?: number;

  @ApiPropertyOptional({ description: '수정된 조회수' })
  @IsOptional()
  @IsNumber()
  views_count?: number;

  @ApiPropertyOptional({ description: '수정된 댓글 수' })
  @IsOptional()
  @IsNumber()
  comments_count?: number;
}
