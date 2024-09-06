import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @ApiProperty({
    description: '리프레시 토큰',
    example: 'your-refresh-token',
  })
  refreshToken: string;
}
