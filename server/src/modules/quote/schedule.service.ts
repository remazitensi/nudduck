/*
 * File Name    : schedule.service.ts
 * Description  : 스케쥴 서비스
 * Author       : 김재영
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.23    김재영      Created     스케쥴 서비스 생성
 */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
}
