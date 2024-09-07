/**
 * File Name    : user.dto.ts
 * Description  : user dto 설정
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.07    이승철      Created
 * 2024.09.07    이승철      Modified    user dto 설정
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
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: '사용자 이메일 주소',
    example: 'test@test.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;
}
