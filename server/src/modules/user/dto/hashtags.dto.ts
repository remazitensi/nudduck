import { ApiProperty } from '@nestjs/swagger';

export class HashtagsDto {
  @ApiProperty({ example: ['tech', 'health'], description: '해시태그 목록' })
  hashtags: string[];
}
