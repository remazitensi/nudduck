/**
 * File Name    : user-profile.dto.ts
 * Description  : 유저 프로필 조회 dto
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.23    이승철      Created
 */

import { LifeGraph } from '@_modules/life-graph/entity/life-graph.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UserProfileDto {
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
      current_age: 25,
      title: 'My Life Graph',
      events: [
        { age: 10, score: 4, title: 'Started school', description: 'Started elementary school' },
        { age: 20, score: 3, title: 'Graduated college', description: "Graduated with a bachelor's degree" },
      ],
      created_at: '2024-09-17T00:00:00.000Z',
      updated_at: '2024-09-17T00:00:00.000Z',
    },
    nullable: true,
    type: () => LifeGraph,
  })
  favoriteLifeGraph?: LifeGraph;
}
