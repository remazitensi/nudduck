import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { EventDto } from './event.dto';

export class CreateLifeGraphDto {
  @ApiProperty({ example: 25, description: '현재 나이' })
  @IsNumber()
  @IsNotEmpty()
  currentAge: number;

  @ApiProperty({ example: 'My Life Graph', description: '그래프 제목' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: [
      { age: 10, score: 4, description: 'Started school' },
      { age: 20, score: 3, description: 'Graduated college' },
    ],
    description: '이벤트 목록',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EventDto)
  events: EventDto[];
}
