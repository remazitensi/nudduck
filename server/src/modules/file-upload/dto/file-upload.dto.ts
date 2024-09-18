/**
 * File Name    : file-upload.dto.ts
 * Description  : 파일 업로드시, 파일명과 파일 타입 dto
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.10    이승철      Created
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class PresignedUrlDto {
  @ApiProperty({
    example: 'abc.png',
    description: '파일명',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @ApiProperty({
    example: 'image/png',
    description: '파일 Content-Type',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  contentType: string;
}
