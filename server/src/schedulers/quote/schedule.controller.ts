import { Controller, Get } from '@nestjs/common';
import { ApiExtraModels, ApiOperation, ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { EnglishSentenceDto } from './dto/english-sentence.dto';
import { QuoteDto } from './dto/quote.dto';
import { QuoteScheduler } from './quote.scheduler';

@ApiTags('Schedule')
@ApiExtraModels(QuoteDto, EnglishSentenceDto)
@Controller('schedule')
export class ScheduleController {
  constructor(private readonly quoteScheduler: QuoteScheduler) {}

  @ApiOperation({
    summary: '명언과 영문장을 함께 조회',
    description: '명언(Quotes)과 영문장(English Sentences)을 한 번에 가져옵니다.',
  })
  @ApiResponse({
    status: 200,
    description: '명언과 영문장의 목록을 반환합니다.',
    schema: {
      type: 'object',
      properties: {
        quotes: {
          type: 'array',
          items: { $ref: getSchemaPath(QuoteDto) },
        },
        englishSentences: {
          type: 'array',
          items: { $ref: getSchemaPath(EnglishSentenceDto) },
        },
      },
    },
  })
  @Get('quotes-and-sentences')
  async getAllData(): Promise<{ quotes: QuoteDto[]; englishSentences: EnglishSentenceDto[] }> {
    const shuffledData = this.quoteScheduler.getShuffledData();
    return {
      quotes: shuffledData.quotes,
      englishSentences: shuffledData.englishSentences,
    };
  }
}
