/*
 * File Name    : chat.interface.ts
 * Description  : 채팅 서비스와 관련된 인터페이스를 정의하여 서비스와 리포지토리 간 결합도를 낮춤
 * Author       : 김재영
 *
 * History
 * Date          Author      Status      Description
 * 2024-09-17    김재영      Created     채팅 관련 인터페이스 정의
 */

export interface CreateRoomDto {
  chatroomName: string; // 채팅방 이름
  userId: number; // 채팅방을 생성한 사용자 ID
}

// 메시지 저장 시 요청 데이터 정의
export interface SaveMessageDto {
  userId: number; // 메시지를 보낸 사용자 ID
  chatroomId: number; // 메시지가 포함된 채팅방 ID
  content: string; // 메시지 내용
}

// 채팅 메시지 데이터 구조 정의
export interface ChatMessage {
  messageId: number; // 메시지 ID
  userId: number; // 메시지를 보낸 사용자 ID
  chatroomId: number; // 메시지가 포함된 채팅방 ID
  content: string; // 메시지 내용
  createdAt: Date; // 메시지 생성 시간
}

// 채팅방 데이터 구조 정의
export interface ChatRoom {
  chatroomId: number; // 채팅방 ID
  chatroomName: string; // 채팅방 이름
  userId: number; // 채팅방을 생성한 사용자 ID
  createdAt: Date; // 채팅방 생성 시간
}
