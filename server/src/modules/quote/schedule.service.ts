import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Quote } from './entities/quote.entity';
import { EnglishSentence } from './entities/english-sentence.entity';
import { QuoteDto } from './dto/quote.dto';
import { EnglishSentenceDto } from './dto/english-sentence.dto';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Quote)
    private quotesRepository: Repository<Quote>,
    @InjectRepository(EnglishSentence)
    private englishSentencesRepository: Repository<EnglishSentence>,
  ) {}

  // Quotes 데이터 조회
  async findAllQuotes(): Promise<QuoteDto[]> {
    const quotes = await this.quotesRepository.find();
    return quotes.map((quote) => ({
      id: quote.id,
      author: quote.author,
      authorProfile: quote.authorProfile,
      message: quote.message,
    }));
  }

  // EnglishSentences 데이터 조회
  async findAllEnglishSentences(): Promise<EnglishSentenceDto[]> {
    const sentences = await this.englishSentencesRepository.find();
    return sentences.map((sentence) => ({
      id: sentence.id,
      english: sentence.english,
      korean: sentence.korean,
      note: sentence.note,
    }));
  }

  // 매일 오전 9시에 Quotes 조회
  @Cron(CronExpression.EVERY_DAY_AT_9AM) // 매일 9시에 실행
  async handleCron() {
    const quotes = await this.findAllQuotes();
    console.log('Quotes at 9 AM:', quotes); // 데이터를 활용하는 로직 추가
  }
}
