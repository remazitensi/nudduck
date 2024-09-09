/**
 * File Name    : update-comment.dto.ts
 * Description  : 댓글 수정 데이터 전송 객체 (DTO)
 * Author       : 김재영
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.10    김재영      Created     댓글 수정 DTO 초기 생성
 */

import { IsString, IsOptional } from 'class-validator';

export class UpdateCommentDto {
  @IsString()
  @IsOptional()
  content?: string;
}
