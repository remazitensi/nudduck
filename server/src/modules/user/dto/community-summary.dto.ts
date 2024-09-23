/**
 * File Name    : community-summary.dto.ts
 * Description  : 나의 게시글 dto
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.23    이승철      Created
 * 2024.09.24    이승철      Modified    날짜 타입 변경
 */

import { Community } from "@_modules/community/entities/community.entity";
import { ApiProperty } from "@nestjs/swagger";

export class CommunitySummaryDto {
  @ApiProperty({
    description: '게시글 ID',
    example: 1,
  })
  postId: number;

  @ApiProperty({
    description: '게시글 작성일',
    example: '2024-02-01',
  })
  createdAt: Date;

  @ApiProperty({
    description: '게시글 제목',
    example: '1:1 대화방 및 스터디 구합니다',
  })
  title: string;

  constructor(community: Community) {
    this.postId = community.postId;
    this.createdAt = community.createdAt;
    this.title = community.title;
  }
}
