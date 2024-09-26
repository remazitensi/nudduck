import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleService } from '@_modules/quote/schedule.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Quote } from '@_modules/quote/entities/quote.entity';
import { EnglishSentence } from '@_modules/quote/entities/english-sentence.entity';
import { Repository } from 'typeorm';

describe('ScheduleService', () => {
  let service: ScheduleService;
  let quotesRepository: Repository<Quote>;
  let englishSentencesRepository: Repository<EnglishSentence>;

  const mockQuoteRepository = {
    find: jest.fn().mockResolvedValue([{ id: 1, author: 'Author', authorProfile: 'Profile', message: 'Message' }]),
  };

  const mockEnglishSentenceRepository = {
    find: jest.fn().mockResolvedValue([{ id: 1, english: 'Hello', korean: '안녕하세요', note: 'Greeting' }]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScheduleService,
        {
          provide: getRepositoryToken(Quote),
          useValue: mockQuoteRepository,
        },
        {
          provide: getRepositoryToken(EnglishSentence),
          useValue: mockEnglishSentenceRepository,
        },
      ],
    }).compile();

    service = module.get<ScheduleService>(ScheduleService);
    quotesRepository = module.get<Repository<Quote>>(getRepositoryToken(Quote));
    englishSentencesRepository = module.get<Repository<EnglishSentence>>(getRepositoryToken(EnglishSentence));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all quotes', async () => {
    const quotes = await service.findAllQuotes();
    expect(quotes).toEqual([{ id: 1, author: 'Author', authorProfile: 'Profile', message: 'Message' }]);
    expect(quotesRepository.find).toHaveBeenCalled();
  });

  it('should return all english sentences', async () => {
    const sentences = await service.findAllEnglishSentences();
    expect(sentences).toEqual([{ id: 1, english: 'Hello', korean: '안녕하세요', note: 'Greeting' }]);
    expect(englishSentencesRepository.find).toHaveBeenCalled();
  });

  it('should log quotes at 9 AM', async () => {
    console.log = jest.fn();
    await service.handleCron();
    expect(console.log).toHaveBeenCalledWith('Quotes at 9 AM:', [{ id: 1, author: 'Author', authorProfile: 'Profile', message: 'Message' }]);
  });
});
