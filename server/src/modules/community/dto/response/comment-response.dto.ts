/**
 * File Name    : comment-response.dto.ts
 * Description  : 댓글 및 대댓글 응답 데이터 전송 객체 (DTO)
 * Author       : 김재영
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.22    김재영      Created     댓글 응답 DTO 초기 생성
 */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CommentResponseDto {
  @ApiProperty({
    description: '댓글 ID',
    example: 101,
  })
  commentId: number;

  @ApiProperty({
    description: '댓글 내용',
    example: '이 게시글에 대한 댓글입니다.',
  })
  content: string;

  @ApiProperty({
    description: '작성 일시',
    example: '2024-09-12T12:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: '수정 일시',
    example: '2024-09-12T12:05:00Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: '대댓글 수',
    example: 2,
  })
  replyCount: number;

  @ApiPropertyOptional({
    description: '대댓글일 경우 부모 댓글의 ID',
    example: 1,
  })
  parentId?: number; // 대댓글일 경우, 부모 댓글 ID

  @ApiProperty({ description: '작성자 닉네임', example: '멋쨍이째영' })
  readonly nickname: string;

  @ApiProperty({ description: '작성자 프로필 사진 URL', example: 'http://nudduck.com/remazitensi.jpg' })
  readonly imageUrl?: string;
}
