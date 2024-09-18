/**
 * File Name    : update-profile.dto.ts
 * Description  : 유저 프로필 업데이트 dto
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.10    이승철      Created
 */

import { ApiProperty } from '@nestjs/swagger';
import { ArrayMaxSize, IsArray, IsOptional, IsString, Length } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({
    example: 'newNickName',
    description: '변경할 닉네임',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(2, 6) // 닉네임 2~6자 제한
  nickname?: string;

  @ApiProperty({
    example: 'https://s3.amazonaws.com/profile-images/example.jpg',
    description: '변경할 프로필 이미지 URL',
    required: false,
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({
    example: ['#개발', '#기술면접'],
    description: '변경할 해시태그 목록',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(5) // 최대 5개의 해시태그 제한
  @Length(1, 5, { each: true }) // 각 해시태그는 1~5자
  hashtags?: string[];
}
