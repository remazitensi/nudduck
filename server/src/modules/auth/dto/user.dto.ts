/**
 * File Name    : user.dto.ts
 * Description  : user dto 설정
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.07    이승철      Created
 * 2024.09.07    이승철      Modified    user dto 설정
 * 2024.09.08    이승철      Modified    nickname 추가
 * 2024.09.10    이승철      Modified    imageUrl 필드 추가
 * 2024.09.16    이승철      Modified    nickname으로 변경
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UserDto {
  @ApiProperty({
    description: 'OAuth 제공자 (예: google, kakao 등)',
    example: 'google',
  })
  @IsString()
  @IsNotEmpty()
  provider: string;

  @ApiProperty({
    description: 'OAuth 제공자의 사용자 고유 ID',
    example: '12345',
  })
  @IsString()
  @IsNotEmpty()
  providerId: string;

  @ApiProperty({
    description: '사용자 이름',
    example: 'Test User',
  })
  @IsString()
  @IsNotEmpty() // 이름을 필수로 설정
  name: string;

  @ApiProperty({
    description: '사용자 이메일 주소',
    example: 'test@test.com',
  })
  @IsEmail()
  @IsNotEmpty() // 이메일을 필수로 설정
  email: string;

  @ApiProperty({
    description: '사용자 닉네임',
    example: 'RandomNick123',
  })
  @IsOptional()
  @IsString()
  nickname?: string;

  //imageUrl 필드 추가
  @ApiProperty({
    description: '프로필 이미지 URL',
    example: 'https://example.com/profile/default.jpg',
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;
}
