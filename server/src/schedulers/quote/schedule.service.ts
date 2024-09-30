import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EnglishSentenceDto } from './dto/english-sentence.dto';
import { QuoteDto } from './dto/quote.dto';
import { EnglishSentence } from './entities/english-sentence.entity';
import { Quote } from './entities/quote.entity';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Quote)
    private readonly quotesRepository: Repository<Quote>,
    @InjectRepository(EnglishSentence)
    private readonly englishSentencesRepository: Repository<EnglishSentence>,
  ) {}

  // Quotes 데이터 조회
  async getAllQuotes(): Promise<QuoteDto[]> {
    const quotes = await this.quotesRepository.find();
    if (!quotes.length) {
      throw new HttpException('명언을 찾을 수 없습니다.', HttpStatus.NOT_FOUND);
    }
    return quotes.map((quote) => ({
      id: quote.id,
      author: quote.author,
      authorProfile: quote.authorProfile,
      message: quote.message,
    }));
  }

  // EnglishSentences 데이터 조회
  async getAllEnglishSentences(): Promise<EnglishSentenceDto[]> {
    const sentences = await this.englishSentencesRepository.find();
    if (!sentences.length) {
      throw new HttpException('영어 문장을 찾을 수 없습니다.', HttpStatus.NOT_FOUND);
    }
    return sentences.map((sentence) => ({
      id: sentence.id,
      english: sentence.english,
      korean: sentence.korean,
      note: sentence.note,
    }));
  }
}
