/**
 * File Name    : file-upload.service.ts
 * Description  : aws s3 presigned 방식 서비스 로직
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.10    이승철      Created
 */

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PresignedUrlDto } from './dto/file-upload.dto';

@Injectable()
export class FileUploadService {
  constructor(
    private readonly s3Client: S3Client,
    private readonly configService: ConfigService,
  ) {}

  async getPresignedUrl(presignedUrlDto: PresignedUrlDto): Promise<string> {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(presignedUrlDto.contentType)) {
      throw new BadRequestException('허용되지 않는 파일 형식입니다.');
    }

    const bucketName = this.configService.get<string>('S3_BUCKET');
    const fileName = `profile-images/${Date.now()}-${presignedUrlDto.fileName}`;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      ContentType: presignedUrlDto.contentType,
    });

    return getSignedUrl(this.s3Client, command, { expiresIn: 60 });
  }

  // 기본 프로필 이미지 URL 반환
  getDefaultProfileImgURL(): string {
    return this.configService.get<string>('DEFAULT_PROFILE_IMAGE_URL');
  }
}
