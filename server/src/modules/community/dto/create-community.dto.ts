/**
 * File Name    : create-community.dto.ts
 * Description  : 커뮤니티 생성 DTO
 * Author       : 김재영
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.07    김재영      Created     커뮤니티 생성 DTO 초기 생성
 * 2024.09.09    김재영      Modified    필드 추가 및 설명 업데이트
 */

import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { Category } from '../enums/category.enum';

export class CreateCommunityDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  user_id: number;

  @IsOptional()
  @IsEnum(Category)
  category?: Category; // 카테고리는 면접, 스터디, 잡담, 모임으로 제한
}
