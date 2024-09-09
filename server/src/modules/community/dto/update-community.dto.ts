/**
 * File Name    : update-community.dto.ts
 * Description  : 커뮤니티 업데이트 DTO
 * Author       : 김재영
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.07    김재영      Created
 * 2024.09.09    김재영      Modified    필드 추가
 */

import { IsOptional, IsString, IsEnum, IsNumber } from 'class-validator';
import { Category } from '../enums/category.enum';

export class UpdateCommunityDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsEnum(Category)
  category?: Category;

  @IsOptional()
  @IsNumber()
  likes_count?: number;

  @IsOptional()
  @IsNumber()
  views_count?: number;

  @IsOptional()
  @IsNumber()
  comments_count?: number;
}
