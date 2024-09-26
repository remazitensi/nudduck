/**
 * File Name    : ai-chat.session.interface.ts
 * Description  : simulation에서 사용할 ai-chat session 타입 interface 설정
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.12    이승철      Created
 */

interface AIChatSession {
  id: number;
  userId: number;
  topic: string;
  createdAt: Date;
}
