import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateLifeGraphDto {
  @ApiPropertyOptional({ description: '제목', example: '수정된 제목' })
  title?: string;

  @ApiPropertyOptional({ description: '설명', example: '수정된 설명' })
  description?: string;

  @ApiPropertyOptional({ description: '그래프 데이터', example: {} })
  data?: any;
}
