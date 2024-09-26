/**
 * File Name    : start-ai.dto.ts
 * Description  : start-ai dto 설정
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.12    이승철      Created
 * 2024.09.12    이승철      Modified    isNewChat으로 이름변경
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class StartAIDto {
  @ApiProperty({
    example: true,
    description: '새로운 채팅을 시작할지 여부를 나타냅니다. true면 새 채팅, false면 기존 채팅 이어받기',
  })
  @IsBoolean()
  isNewChat: boolean;
}
