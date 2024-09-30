/**
 * File Name    : my-profile.dto.ts
 * Description  : 나의 프로필 조회 dto
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.10    이승철      Created
 * 2024.09.16    이승철      Modified    프로필에 인생그래프 추가
 * 2024.09.17    이승철      Modified    즐겨찾기 인생그래프 타입변경
 * 2024.09.21    이승철      Modified    즐겨찾기 인생그래프 예시 추가
 * 2024.09.23    이승철      Modified    MyProfileDto로 변경
 * 2024.09.23    이승철      Modified    유저가 작성한 게시글 목록
 * 2024.09.24    이승철      Modified    카멜케이스로 변경
 * 2024.09.24    이승철      Modified    가입일 반환
 */

import { MyCommunitySummaryDto } from '@_modules/user/dto/my-community-summary.dto';
import { LifeGraph } from '@_modules/life-graph/entity/life-graph.entity';
import { ApiProperty } from '@nestjs/swagger';

export class MyProfileDto {
  @ApiProperty({ description: '유저 닉네임', example: 'JohnDoe123' })
  nickname: string;

  @ApiProperty({ description: '유저 이메일', example: 'john.doe@example.com' })
  email: string;

  @ApiProperty({ description: '유저 이름', example: 'John Doe' })
  name: string;

  @ApiProperty({ description: '프로필 이미지 URL', example: 'https://example.com/profile-image.jpg' })
  imageUrl: string;

  @ApiProperty({ description: '유저 해시태그 목록', example: ['Developer', 'Blogger'] })
  hashtags: string[];

  @ApiProperty({
    description: '즐겨찾기한 인생 그래프',
    example: {
      id: 1,
      currentAge: 25,
      title: 'My Life Graph',
      events: [
        { age: 10, score: 4, title: 'Started school', description: 'Started elementary school' },
        { age: 20, score: 3, title: 'Graduated college', description: "Graduated with a bachelor's degree" },
      ],
      createdAt: '2024-09-17T00:00:00.000Z',
      updatedAt: '2024-09-17T00:00:00.000Z',
    },
    nullable: true,
    type: () => LifeGraph,
  })
  favoriteLifeGraph?: LifeGraph;

  @ApiProperty({
    description: '유저가 작성한 게시글 목록',
    type: [MyCommunitySummaryDto],
  })
  posts: MyCommunitySummaryDto[];

  @ApiProperty({ description: '전체 게시글 수', example: 100 })
  totalCount: number;

  @ApiProperty({ description: '프로필 생성일', example: '2024-09-24' })
  createdAt: Date;
}
