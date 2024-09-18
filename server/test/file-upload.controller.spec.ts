/**
 * File Name    : file-upload.controller.ts
 * Description  : file-upload controller 테스트
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.16    이승철      Created
 */

import { FileUploadController } from '@_modules/file-upload/file-upload.controller';
import { FileUploadService } from '@_modules/file-upload/file-upload.service';
import { Test, TestingModule } from '@nestjs/testing';
import { PresignedUrlDto } from '@_modules/file-upload/dto/file-upload.dto';

describe('FileUploadController', () => {
  let controller: FileUploadController;
  let fileUploadService: jest.Mocked<FileUploadService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FileUploadController],
      providers: [
        {
          provide: FileUploadService,
          useValue: {
            getPresignedUrl: jest.fn(), // Mocking the service method
          },
        },
      ],
    }).compile();

    controller = module.get<FileUploadController>(FileUploadController);
    fileUploadService = module.get(FileUploadService);
  });

  describe('getPresignedUrl', () => {
    it('should return a presigned URL', async () => {
      const presignedUrlDto: PresignedUrlDto = {
        fileName: 'test.png',
        contentType: 'image/png',
      };

      const mockPresignedUrl = 'https://mock-presigned-url.com';
      fileUploadService.getPresignedUrl.mockResolvedValue(mockPresignedUrl);

      const result = await controller.getPresignedUrl(presignedUrlDto);

      expect(result).toEqual({ presignedURL: mockPresignedUrl });
      expect(fileUploadService.getPresignedUrl).toHaveBeenCalledWith(presignedUrlDto);
    });
  });
});
