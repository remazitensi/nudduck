import { ApiProperty } from '@nestjs/swagger';

export class GetExpertsDto {
  @ApiProperty({ description: '페이지 번호', example: 1 })
  page: number;
}
