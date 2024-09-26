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
 * 2024.09.23    김재영      Modified    검증 데코레이터 추가 및 필드 검증 강화
 * 2024.09.23    김재영      Modified    제목 30자 이내, 내용 최소 10자 이상으로 제한
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsNumber, IsEnum, Length } from 'class-validator';
import { Category } from '@_modules/community/enums/category.enum';

export class CreateCommunityDto {
  @ApiProperty({
    description: '커뮤니티 게시글의 제목',
    example: 'NestJS 프로젝트 질문 있습니다!',
  })
  @IsNotEmpty({ message: '제목은 비워둘 수 없습니다.' })
  @Length(1, 30, { message: '제목은 최대 30자 이내로 작성해야 합니다.' }) // 제목 30자 이내로 제한
  title: string;

  @ApiProperty({
    description: '커뮤니티 게시글의 내용',
    example: 'NestJS 프로젝트에서 TypeORM 설정 문제를 겪고 있습니다. 해결 방법이 있을까요?',
  })
  @IsNotEmpty({ message: '내용은 비워둘 수 없습니다.' })
  @Length(10, 1000, { message: '내용은 최소 10자 이상 작성해야 합니다.' }) // 내용 최소 10자 이상
  content: string;

  @ApiPropertyOptional({
    description: '커뮤니티 게시글의 카테고리',
    enum: Category,
    example: 'STUDY',
  })
  @IsOptional()
  @IsEnum(Category, { message: '유효한 카테고리를 선택해야 합니다.' })
  category?: Category;

  @ApiProperty({
    description: '유저 ID',
    example: 1, // 예시 유저 ID 추가
  })
  @IsNumber()
  userId: number;
}
