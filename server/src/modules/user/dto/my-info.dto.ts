/**
 * File Name    : my-info.dto.ts
 * Description  : 내 정보 조회 dto
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.30    이승철      Created
 */

import { ApiProperty } from '@nestjs/swagger';

export class MyInfoDto {
  @ApiProperty({ description: '유저 ID', example: 1 })
  id: number;

  @ApiProperty({ description: '유저 닉네임', example: 'JohnDoe' })
  nickname: string;

  @ApiProperty({ description: '유저 이메일', example: 'john.doe@example.com' })
  email: string;

  @ApiProperty({ description: '프로필 이미지 URL', example: 'https://example.com/profile.jpg' })
  imageUrl: string;

  @ApiProperty({ description: '유저 이름', example: 'John Doe' })
  name: string;
}
