import { ApiProperty } from '@nestjs/swagger';
import { CommunityDto } from './community.dto';

export class PostsResponseDto {
  @ApiProperty({ description: '전체 게시글 수', example: 2 })
  total: number;

  @ApiProperty({
    type: [CommunityDto],
    description: '게시글 목록',
    example: [
      {
        postId: 1,
        title: '스터디 구해용용가리',
        viewCount: 100,
        createdAt: '2024-09-20T10:00:00.000Z',
        category: 'STUDY',
        user: '멋쨍이 재영',
      },
      {
        postId: 2,
        title: '프론트엔드 개발자 구합니다',
        viewCount: 150,
        createdAt: '2024-09-21T12:30:00.000Z',
        category: 'JOB',
        user: '기요미 민지',
      },
    ],
  })
  posts: CommunityDto[];

  constructor(total: number, posts: CommunityDto[]) {
    this.total = total;
    this.posts = posts;
  }
}
