import { EnglishSentenceDto } from '@_modules/quote/dto/english-sentence.dto';
import { QuoteDto } from '@_modules/quote/dto/quote.dto';
import { EnglishSentence } from '@_modules/quote/entities/english-sentence.entity';
import { Quote } from '@_modules/quote/entities/quote.entity';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ScheduleService {
  private readonly logger = new Logger(ScheduleService.name);

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

  // 매일 오전 7시에 Quotes 조회 및 처리
  @Cron(CronExpression.EVERY_DAY_AT_7AM)
  async handleCron() {
    try {
      const quotes = await this.findAllQuotes();

      // 조회한 데이터를 로그로 남기기 (또는 다른 처리를 추가)
      this.logger.log('성공적으로 명언을 조회했습니다: ', quotes);

      // 만약 다른 처리 로직이 필요하다면 여기에 추가
      // 예: 조회한 데이터를 파일로 저장하거나, 다른 API로 전달하는 로직 등
    } catch (error) {
      this.logger.error('명언을 가져오는 도중 오류가 발생했습니다.', error);
      throw new HttpException('명언을 가져오는 도중 오류가 발생했습니다.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
