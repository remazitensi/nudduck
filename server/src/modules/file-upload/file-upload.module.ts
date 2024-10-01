/**
 * File Name    : file-upload.module.ts
 * Description  : aws s3 presigned 방식 파일 업로드 모듈
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.10    이승철      Created
 * 2024.09.16    이승철      Modified    절대경로 변경
 */

import { FileUploadController } from '@_modules/file-upload/file-upload.controller';
import { FileUploadService } from '@_modules/file-upload/file-upload.service';
import { S3Client } from '@aws-sdk/client-s3';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [],
  controllers: [FileUploadController],
  providers: [
    {
      provide: S3Client,
      useFactory: (configService: ConfigService) => {
        return new S3Client({
          region: configService.get('AWS_REGION'),
          credentials: {
            accessKeyId: configService.get('S3_ACCESS_KEY'),
            secretAccessKey: configService.get('S3_SECRET_KEY'),
          },
        });
      },
      inject: [ConfigService],
    },
    FileUploadService,
  ],
  exports: [FileUploadService, S3Client],
})
export class FileUploadModule {}
