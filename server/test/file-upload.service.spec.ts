import { FileUploadService } from '@_file-upload/file-upload.service';
import { S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

describe('FileUploadService', () => {
  let service: FileUploadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FileUploadService,
        {
          provide: S3Client,
          useValue: {
            send: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
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
          },
        },
      ],
    }).compile();

    service = module.get<FileUploadService>(FileUploadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return presigned URL', async () => {
    const mockPresignedUrlDto = {
      fileName: 'test.png',
      contentType: 'image/png',
    };

    const mockPresignedUrl = 'https://mock-presigned-url.com';
    jest.spyOn(service, 'getPresignedUrl').mockResolvedValue(mockPresignedUrl);

    const result = await service.getPresignedUrl(mockPresignedUrlDto);

    expect(result).toEqual(mockPresignedUrl);
  });
});
