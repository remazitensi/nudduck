/**
 * File Name    : profile.dto.ts
 * Description  : 유저 프로필 조회 dto
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.10    이승철      Created
 */

import { ApiProperty } from '@nestjs/swagger';

export class ProfileDto {
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
}
