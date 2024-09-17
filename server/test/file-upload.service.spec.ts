/**
 * File Name    : file-upload.service.ts
 * Description  : file-upload service 테스트
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.16    이승철      Created
 */

import { FileUploadService } from '@_modules/file-upload/file-upload.service';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { BadRequestException } from '@nestjs/common';

jest.mock('@aws-sdk/s3-request-presigner', () => ({
  getSignedUrl: jest.fn(),
}));

describe('FileUploadService', () => {
  let service: FileUploadService;
  let mockS3Client: Partial<S3Client>;
  let mockConfigService: Partial<ConfigService>;

  beforeEach(async () => {
    mockS3Client = {
      send: jest.fn(),
    };
    
    mockConfigService = {
      get: jest.fn((key: string) => {
        switch (key) {
          case 'S3_BUCKET':
            return 'nudduck';
          case 'DEFAULT_PROFILE_IMAGE_URL':
            return 'https://nudduck.s3.ap-northeast-2.amazonaws.com/Default-Profile-Picture.png';
          default:
            return null;
        }
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FileUploadService,
        {
          provide: S3Client,
          useValue: mockS3Client,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<FileUploadService>(FileUploadService);
  });

  it('should return presigned URL when valid contentType is provided', async () => {
    const mockPresignedUrlDto = {
      fileName: 'test.png',
      contentType: 'image/png',
    };
    const mockPresignedUrl = 'https://mock-presigned-url.com';

    (getSignedUrl as jest.Mock).mockResolvedValue(mockPresignedUrl);

    const result = await service.getPresignedUrl(mockPresignedUrlDto);
    expect(result).toEqual(mockPresignedUrl);
    expect(getSignedUrl).toHaveBeenCalledWith(
      mockS3Client,
      expect.any(PutObjectCommand),
      { expiresIn: 60 },
    );
  });

  it('should throw BadRequestException when invalid contentType is provided', async () => {
    const mockPresignedUrlDto = {
      fileName: 'test.gif',
      contentType: 'application/pdf',
    };

    await expect(service.getPresignedUrl(mockPresignedUrlDto)).rejects.toThrow(
      BadRequestException,
    );
  });
});
