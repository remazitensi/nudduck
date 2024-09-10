/**
 * File Name    : file-upload.controller.ts
 * Description  : aws s3 presigned url 요청 컨트롤러
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.10    이승철      Created
 */

import { Jwt } from '@_auth/guards/jwt';
import { PresignedUrlDto } from '@_file-upload/dto/file-upload.dto';
import { FileUploadService } from '@_file-upload/file-upload.service';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';

@Controller('presigned-url')
@UseGuards(Jwt)
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post()
  async getPresignedUrl(@Body() body: PresignedUrlDto): Promise<{ presignedURL: string }> {
    const presignedURL = await this.fileUploadService.getPresignedUrl(body);
    return { presignedURL };
  }
}
