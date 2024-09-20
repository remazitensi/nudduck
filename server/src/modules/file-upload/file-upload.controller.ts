/**
 * File Name    : file-upload.controller.ts
 * Description  : aws s3 presigned url 요청 컨트롤러
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.10    이승철      Created
 * 2024.09.16    이승철      Modified    절대경로 변경
 * 2024.09.19    이승철      Modified    ApiResponse 추가
 * 2024.09.19    이승철      Modified    ApiTags 추가
 * 2024.09.21    이승철      Modified    응답 dto 추가
 * 2024.09.21    이승철      Modified    절대경로 변경
 */

import { Jwt } from '@_modules/auth/guards/jwt';
import { PresignedUrlDto } from '@_modules/file-upload/dto/file-upload.dto';
import { PresignedUrlResponseDto } from '@_modules/file-upload/dto/presigned-url-response.dto';
import { FileUploadService } from '@_modules/file-upload/file-upload.service';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('presigned-url')
@Controller('presigned-url')
@UseGuards(Jwt)
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @ApiOperation({ summary: 'Presigned URL 요청', description: 'AWS S3에 파일을 업로드하기 위한 presigned URL을 요청합니다.' })
  @ApiBody({ description: '파일명과 파일 타입을 전달하여 presigned URL을 생성합니다.', type: PresignedUrlDto })
  @ApiResponse({ status: 200, description: '성공적으로 presigned URL을 반환합니다.', type: PresignedUrlResponseDto })
  @ApiResponse({ status: 400, description: '잘못된 요청입니다.' })
  @Post()
  async getPresignedUrl(@Body() body: PresignedUrlDto): Promise<PresignedUrlResponseDto> {
    const presignedURL = await this.fileUploadService.getPresignedUrl(body);
    return { presignedURL };
  }
}
