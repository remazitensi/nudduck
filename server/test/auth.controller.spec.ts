import { PresignedUrlDto } from '@_file-upload/dto/file-upload.dto';
import { FileUploadController } from '@_file-upload/file-upload.controller';
import { FileUploadService } from '@_file-upload/file-upload.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('FileUploadController', () => {
  let controller: FileUploadController;
  let fileUploadService: FileUploadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FileUploadController],
      providers: [
        {
          provide: FileUploadService,
          useValue: {
            getPresignedUrl: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<FileUploadController>(FileUploadController);
    fileUploadService = module.get<FileUploadService>(FileUploadService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getPresignedUrl', () => {
    it('should return presigned URL', async () => {
      const presignedUrlDto: PresignedUrlDto = {
        fileName: 'test.png',
        contentType: 'image/png',
      };

      const mockPresignedUrl = 'https://mock-presigned-url.com';
      jest.spyOn(fileUploadService, 'getPresignedUrl').mockResolvedValue(mockPresignedUrl);

      const result = await controller.getPresignedUrl(presignedUrlDto);

      expect(result).toEqual({ presignedURL: mockPresignedUrl });
      expect(fileUploadService.getPresignedUrl).toHaveBeenCalledWith(presignedUrlDto);
    });
  });
});
