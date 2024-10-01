import { HttpException, HttpStatus, Injectable, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { EnglishSentenceDto } from './dto/english-sentence.dto';
import { QuoteDto } from './dto/quote.dto';
import { ScheduleService } from './schedule.service';

@Injectable()
export class QuoteScheduler implements OnModuleInit {
  private shuffledQuotes: QuoteDto[] = [];
  private shuffledSentences: EnglishSentenceDto[] = [];

  constructor(private readonly scheduleService: ScheduleService) {}

  // 모듈 초기화 시 데이터 가져오기
  async onModuleInit() {
    await this.handleCron(); // 서버 시작 시 데이터를 가져오기
  }

  @Cron('0 1 * * *') // 매일 한국 기준 아침 10시에 실행
  async handleCron() {
    try {
      const quotes = await this.scheduleService.getAllQuotes();
      const sentences = await this.scheduleService.getAllEnglishSentences();

      // 배열의 순서를 랜덤으로 섞기
      this.shuffledQuotes = this.shuffleArray([...quotes]);
      this.shuffledSentences = this.shuffleArray([...sentences]);
    } catch {
      throw new HttpException('명언이나 영어 문장을 가져오는 도중 오류가 발생했습니다.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // 배열을 랜덤으로 섞는 메서드
  private shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // 섞인 데이터를 반환하는 메서드
  getShuffledData() {
    return {
      quotes: this.shuffledQuotes,
      englishSentences: this.shuffledSentences,
    };
  }
}
