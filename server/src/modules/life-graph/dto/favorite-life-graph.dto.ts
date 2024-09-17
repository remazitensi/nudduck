import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class FavoriteLifeGraphDto {
  @ApiProperty({ example: 1, description: '즐겨찾기할 그래프 ID' })
  @IsNumber()
  graphId: number;
}
