import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Quote } from '@_modules/Quote/entities/quote.entity';
import { EnglishSentence } from '@_modules/Quote/entities/english-sentence.entity';
import { QuoteDto } from '@_modules/Quote/dto/quote.dto';
import { EnglishSentenceDto } from '@_modules/Quote/dto/english-sentence.dto';

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
  async findAllEnglishSentences(): Promise<EnglishSentenceDto[]> {
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

  // 매일 오전 7시에 Quotes 조회
  @Cron(CronExpression.EVERY_DAY_AT_7AM) // 매일 9시에 실행
  async handleCron() {
    const quotes = await this.findAllQuotes();
    if (!quotes) {
      throw new HttpException('명언을 가져오는 도중 오류가 발생했습니다.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    throw new HttpException('명언을 성공적으로 가져왔습니다.', HttpStatus.OK);
  }
}
