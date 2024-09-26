/**
 * File Name    : community.dto.ts
 * Description  : 커뮤니티 게시글 DTO
 * Author       : 김재영
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.20    김재영      Created     커뮤니티 게시글 DTO 생성
 * 2024.09.24    이승철      Modified    카멜케이스로 변경
 * 2024.09.24    이승철      Modified    게시글 내용 수정
 */

import { ApiProperty } from '@nestjs/swagger';
import { Category } from '@_modules/community/enums/category.enum';
import { Community } from '@_modules/community/entities/community.entity';

export class CommunityResponseDto {
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
    description: '게시글 내용',
    example: '여기서 스터디를 구합니다!',
  })
  content: string;

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
    example: 'study',
  })
  category?: Category; // 카테고리

  @ApiProperty({ description: '작성자 닉네임', example: '멋쨍이 재영' })
  readonly nickname: string;

  @ApiProperty({ description: '작성자 프로필 사진 URL', example: 'http://nudduck.com/remazitensi.jpg' })
  readonly imageUrl?: string;

  @ApiProperty({ description: '작성자 ID', example: 1 })
  readonly userId: number;

  constructor(community: Community) {
    this.postId = community.postId;
    this.title = community.title;
    this.content = community.content;
    this.viewCount = community.viewCount;
    this.createdAt = community.createdAt;
    this.category = community.category;
    this.userId = community.user?.id || null;
    this.nickname = community.user.nickname; // 작성자 닉네임
    this.imageUrl = community.user.imageUrl; // 작성자 프로필 사진 URL
  }
}
