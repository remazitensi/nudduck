/**
 * File Name    : refresh-token.dto.ts
 * Description  : rf dto 설정
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.07    이승철      Created
 * 2024.09.08    이승철      Modified    rf dto 설정
 * 2024.09.11    이승철      Modified    refreshToken dto 재추가
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({
    description: '리프레시 토큰',
    example: 'your-refresh-token',
  })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
