import { FileUploadController } from '@_file-upload/file-upload.controller';
import { FileUploadService } from '@_file-upload/file-upload.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('FileUploadController', () => {
  let controller: FileUploadController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FileUploadController],
      providers: [
        {
          provide: FileUploadService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<FileUploadController>(FileUploadController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
