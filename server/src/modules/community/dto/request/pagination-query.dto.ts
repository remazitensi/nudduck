/**
 * File Name    : pagination-query.dto.ts
 * Description  : 페이지네이션 요청 시 사용되는 DTO
 * Author       : 김재영
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.11    김재영      Created     페이지네이션 DTO 초기 생성
 * 2024.09.12    김재영      Modified    Swagger 데코레이터 및 기본값 추가
 * 2024.09.23    김재영      Modified    limit, offset 추가하여 무한 스크롤 지원
 * 2024.09.27    김재영      Modified    page, pageSize 및 limit, offset 통합 관리
 */

import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive, IsString, Matches, Min } from 'class-validator';

export class PaginationQueryDto {
  // 페이지 기반 페이징 (커뮤니티 전용)
  @ApiPropertyOptional({
    description: '조회할 페이지 번호 (기본값: 1)',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number) // 문자열을 숫자로 변환
  page?: number = 1; // 기본값 1로 설정

  @ApiPropertyOptional({
    description: '페이지당 항목 수 (기본값: 10)',
    example: 10,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number) // 문자열을 숫자로 변환
  pageSize?: number = 10; // 기본값 10으로 설정

  // 오프셋 기반 페이징 (댓글 전용)
  @ApiPropertyOptional({
    description: '조회할 항목 수 (limit, 기본값: 10)',
    example: 10,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number) // 문자열을 숫자로 변환
  limit?: number = 10; // 기본값 10으로 설정

  @ApiPropertyOptional({
    description: '조회 시작 지점 (offset, 기본값: 0)',
    example: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number) // 문자열을 숫자로 변환
  offset?: number = 0; // 기본값 0으로 설정

  // 정렬 기준
  @ApiPropertyOptional({
    description: '정렬 기준 (예: createdAt:desc)',
    example: 'createdAt:desc',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Matches(/^(createdAt|viewCount):(asc|desc)$/i, { message: '유효하지 않은 정렬 값입니다.' })
  sort?: string;
}
