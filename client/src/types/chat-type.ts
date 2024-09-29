// 1:1 채팅방 생성 시 요청 데이터
export interface CreateRoomData {
  participants: number[]; // 채팅방에 참가하는 사용자 ID 목록
}

// 메시지 전송 시 요청 데이터
export interface SendMessageData {
  senderId: number; // 메시지를 보낸 사용자 ID
  content: string; // 메시지 내용
}

// 채팅 메시지 데이터 구조
export interface ChatMessageData {
  messageId: string; // 메시지 ID
  userId: number; // 메시지를 보낸 사용자 ID
  chatroomId: string; // 메시지가 포함된 채팅방 ID
  content: string; // 메시지 내용
  createdAt: Date; // 메시지 생성 시간
}

// 채팅방 데이터 구조
export interface ChatRoomData {
  roomId: string; // 채팅방 ID
  participants: number[]; // 참가자 ID 목록
  messages?: Array<{ name: string; msg: string; time: string }>; // 메시지 배열 추가
}
