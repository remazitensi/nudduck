import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, getSchemaPath, ApiExtraModels } from '@nestjs/swagger';
import { ScheduleService } from './schedule.service';
import { QuoteDto } from './dto/quote.dto';
import { EnglishSentenceDto } from './dto/english-sentence.dto';

@ApiTags('Schedule')
@ApiExtraModels(QuoteDto, EnglishSentenceDto) // DTO 모델을 추가하여 Swagger가 참조할 수 있게 설정
@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

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
    const quotes = await this.scheduleService.findAllQuotes();
    const englishSentences = await this.scheduleService.findAllEnglishSentences();

    return {
      quotes,
      englishSentences,
    };
  }
}
