/**
 * File Name    : create-community.dto.ts
 * Description  : 커뮤니티 생성 DTO
 * Author       : 김재영
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.07    김재영      Created     커뮤니티 생성 DTO 초기 생성
 * 2024.09.09    김재영      Modified    필드 추가 및 설명 업데이트
 * 2024.09.12    김재영      Modified    Swagger 데코레이터 및 예시 추가
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { Category } from '@_modules/community/enums/category.enum';

export class CreateCommunityDto {
  @ApiProperty({
    description: '커뮤니티 게시글의 제목',
    example: 'NestJS 프로젝트 질문 있습니다!',
  })
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: '커뮤니티 게시글의 내용',
    example: 'NestJS 프로젝트에서 TypeORM 설정 문제를 겪고 있습니다. 해결 방법이 있을까요?',
  })
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({
    description: '커뮤니티 게시글의 카테고리',
    enum: Category,
    example: 'STUDY',
  })
  @IsOptional()
  @IsEnum(Category)
  category?: Category; // 카테고리는 면접, 스터디, 잡담, 모임으로 제한
}
