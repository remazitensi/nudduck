/**
 * File Name    : update-reply.dto.ts
 * Description  : 대댓글 수정 데이터 전송 객체 (DTO)
 * Author       : 김재영
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.10    김재영      Created     대댓글 수정 DTO 초기 생성
 */

import { IsString, IsOptional } from 'class-validator';

export class UpdateReplyDto {
  @IsString()
  @IsOptional()
  content?: string;
}
