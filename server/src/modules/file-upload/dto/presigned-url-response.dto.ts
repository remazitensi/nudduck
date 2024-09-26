/**
 * File Name    : presigned-url-response.dto.ts
 * Description  : presigned-url-response dto 설정
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.21    이승철      Created
 */

import { ApiProperty } from '@nestjs/swagger';

export class PresignedUrlResponseDto {
  @ApiProperty({ example: 'https://example-presigned-url.com', description: 'Presigned URL' })
  presignedURL: string;
}
