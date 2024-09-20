/**
 * File Name    : community.dto.ts
 * Description  : 커뮤니티 게시글 DTO (제목만 포함)
 * Author       : 김재영
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.20    김재영      Created     커뮤니티 게시글 제목만 포함한 DTO 생성
 */

import { ApiProperty } from '@nestjs/swagger';
import { User } from '@_modules/user/entity/user.entity';
import { Category } from '../enums/category.enum';

export class CommunityDto {
  @ApiProperty({
    description: '게시글 ID',
    example: 1,
  })
  postId: number;

  @ApiProperty({
    description: '게시글 제목',
    example: '스터디 구해용용가리',
  })
  title: string;

  @ApiProperty({
    description: '조회수',
    example: 100,
  })
  viewCount: number; // 조회수

  @ApiProperty({
    description: '작성일',
    example: '2024-09-20T10:00:00.000Z',
  })
  createdAt: Date; // 작성일

  @ApiProperty({
    description: '카테고리',
    enum: Category,
    example: 'STUDY',
  })
  category?: Category; // 카테고리

  @ApiProperty({
    description: '작성자 정보',
    example: '멋쨍이 재영',
    type: User,
  })
  user: User; // 작성자 정보
}
