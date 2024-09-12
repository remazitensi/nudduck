/**
 * File Name    : update-comment.dto.ts
 * Description  : 댓글 수정 데이터 전송 객체 (DTO)
 * Author       : 김재영
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.10    김재영      Created     댓글 수정 DTO 초기 생성
 * 2024.09.12    김재영      Modified    Swagger 데코레이터 추가
 */

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateCommentDto {
  @ApiPropertyOptional({ description: '댓글의 수정된 내용' })
  @IsString()
  @IsOptional()
  content?: string;
}
