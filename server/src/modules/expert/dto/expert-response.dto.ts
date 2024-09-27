/**
 * File Name    : expert-response.dto.ts
 * Description  : expert-response dto 설정
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.21    이승철      Created
 */

import { ApiProperty } from '@nestjs/swagger';

export class ExpertResponseDto {
  @ApiProperty({ example: 1, description: '전문가 ID' })
  id: number;

  @ApiProperty({ example: 'John Doe', description: '전문가 이름' })
  name: string;

  @ApiProperty({ example: 'Software Developer', description: '전문가 직업' })
  jobTitle: string;

  @ApiProperty({ example: 35, description: '전문가 나이' })
  age: number;

  @ApiProperty({ example: '10년 이상의 소프트웨어 개발 경험', description: '전문가 소개' })
  bio: string;

  @ApiProperty({ example: 'https://example.com/profile-image.jpg', description: '프로필 이미지 URL' })
  profileImage: string;

  @ApiProperty({ example: 'john.doe@example.com', description: '전문가 이메일' })
  email: string;

  @ApiProperty({ example: '010-1234-5678', description: '전문가 전화번호' })
  phone: string;

  @ApiProperty({ example: 50000, description: '전문가 비용' })
  cost: number;

  @ApiProperty({ example: 'Developer, Engineer', description: '전문가 해시태그' })
  hashtags: string;
}

export class ExpertListResponseDto {
  @ApiProperty({ type: [ExpertResponseDto], description: '전문가 목록' })
  data: ExpertResponseDto[];

  @ApiProperty({ example: 100, description: '전체 전문가 수' })
  totalCount: number;
}
