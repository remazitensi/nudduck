/**
 * File Name    : favorite-life-graph.dto.ts
 * Description  : 인생그래프 즐겨찾기 dto
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.17    이승철      Created
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class FavoriteLifeGraphDto {
  @ApiProperty({ example: 1, description: '즐겨찾기할 그래프 ID' })
  @IsNumber()
  graphId: number;
}
