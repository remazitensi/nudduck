import { Injectable } from '@nestjs/common';
import { RoomRepository } from '@_modules/chat/repositories/room.repository';
import { MessageRepository } from '@_modules/chat/repositories/message.repository';
import { ChatRoom, CreateRoomDto, SaveMessageDto, ChatMessage } from '@_modules/chat/interfaces/chat.interface';

@Injectable()
export class ChatService {
  constructor(
    private readonly roomRepository: RoomRepository,
    private readonly messageRepository: MessageRepository,
  ) {}

  // 1:1 채팅방 찾기
  async findRoom(userId: number, recipientId: number): Promise<ChatRoom | undefined> {
    return this.roomRepository.findByUsers(userId, recipientId);
  }

  // 1:1 채팅방 생성
  async createRoom(roomData: CreateRoomDto): Promise<ChatRoom> {
    return this.roomRepository.createRoom(roomData);
  }

  // 채팅방 ID로 채팅방 조회
  async getRoomById(roomId: number): Promise<ChatRoom | undefined> {
    return this.roomRepository.findRoomById(roomId);
  }

  // 모든 채팅방 목록 조회
  async getAllRooms(): Promise<ChatRoom[]> {
    return this.roomRepository.findAllRooms();
  }

  // 1:1 채팅방에 메시지 저장
  async saveMessage(messageData: SaveMessageDto): Promise<ChatMessage> {
    try {
      const savedMessage = await this.messageRepository.saveMessage(messageData);

      return {
        messageId: savedMessage.messageId,
        userId: savedMessage.user.id,
        chatroomId: savedMessage.chatroom.chatroomId,
        content: savedMessage.content,
        createdAt: savedMessage.timestamp,
      };
    } catch {
      throw new Error('메시지 저장에 실패했습니다.');
    }
  }

  // 특정 채팅방의 메시지 조회
  async getMessagesByRoom(roomId: number): Promise<ChatMessage[]> {
    try {
      const messages = await this.messageRepository.findMessagesByRoom(roomId);

      // Message 배열을 ChatMessage 배열로 변환
      const chatMessages: ChatMessage[] = messages.map((msg) => ({
        messageId: msg.messageId,
        userId: msg.user.id,
        chatroomId: msg.chatroom.chatroomId,
        content: msg.content,
        createdAt: msg.timestamp,
      }));

      return chatMessages;
    } catch {
      throw new Error('메시지 조회에 실패했습니다.');
    }
  }
}
