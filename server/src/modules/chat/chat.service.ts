import { Injectable } from '@nestjs/common';
import { RoomRepository } from '@_modules/chat/repositories/room.repository';
import { MessageRepository } from '@_modules/chat/repositories/message.repository';
import { RedisService } from '@_modules/redis/redis.service';
import { ChatRoom, CreateRoomDto, SaveMessageDto, ChatMessage } from '@_modules/chat/interfaces/chat.interface';

@Injectable()
export class ChatService {
  constructor(
    private readonly roomRepository: RoomRepository,
    private readonly messageRepository: MessageRepository,
    private readonly redisService: RedisService,
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

      // Redis에 메시지 저장
      const redisKey = `message:${savedMessage.chatroom.chatroomId}:${savedMessage.messageId}`;
      await this.redisService.set(redisKey, JSON.stringify(savedMessage));

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
      // Redis에서 메시지 조회
      const keys = await this.redisService.getClient().keys(`message:${roomId}:*`);

      const messages: ChatMessage[] = [];

      for (const key of keys) {
        const messageData = await this.redisService.get(key);
        if (messageData) {
          messages.push(JSON.parse(messageData));
        }
      }

      return messages;
    } catch {
      throw new Error('메시지 조회에 실패했습니다.');
    }
  }
}
