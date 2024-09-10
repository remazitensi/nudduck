import { FileUploadService } from '@_file-upload/file-upload.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('FileUploadService', () => {
  let service: FileUploadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FileUploadService],
    }).compile();

    service = module.get<FileUploadService>(FileUploadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
