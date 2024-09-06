import { ApiProperty } from '@nestjs/swagger';

export class CreateLifeGraphDto {
  @ApiProperty({ description: '제목', example: '내 인생그래프' })
  title: string;

  @ApiProperty({ description: '설명', example: '내 인생의 중요한 이벤트들' })
  description: string;

  @ApiProperty({ description: '그래프 데이터', example: {} })
  data: any;
}
