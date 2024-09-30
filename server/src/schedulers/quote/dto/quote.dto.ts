/*
 * File Name    : quote.dto.ts
 * Description  : 명언 DTO
 * Author       : 김재영
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.23    김재영      Created     명언 dto 생성
 */

import { ApiProperty } from '@nestjs/swagger';

export class QuoteDto {
  @ApiProperty({ example: 1, description: '명언의 고유 ID' })
  id: number;

  @ApiProperty({ example: '김재영', description: '저자 이름' })
  author: string;

  @ApiProperty({ example: '작가', description: '저자 프로필' })
  authorProfile: string;

  @ApiProperty({ example: '삶은 계란이다...', description: '명언 메시지' })
  message: string;
}
