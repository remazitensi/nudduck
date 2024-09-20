import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { MessageRepository } from './repositories/message.repository';
import { RoomRepository } from './repositories/room.repository';
import { v4 as uuidv4 } from 'uuid';
import { Message } from './entities/message.entity';
import { ChatRoom } from './entities/chat-room.entity';
import { WsException } from '@nestjs/websockets';

// 커스텀 WebSocket 예외 클래스
export class CustomWsException extends WsException {
  constructor(message: string) {
    super(message);
  }
}

@Injectable()
export class ChatService {
  constructor(
    private readonly roomRepository: RoomRepository,
    private readonly messageRepository: MessageRepository,
    private readonly userService: UserService,
    private readonly redisService: RedisService,
  ) {}

  /**
   * 1대1 방 생성
   * @param user 사용자 객체
   * @param recipientId 수신자 ID
   * @returns 생성된 방의 이름
   */
  async createRoom(user: User, recipientId: number): Promise<string> {
    // 수신자 유효성 검사
    const recipient = await this.userService.findUserById(recipientId);
    if (!recipient) {
      throw new CustomWsException('수신자가 존재하지 않습니다.');
    }

    // 기존 방이 있는지 확인
    const existingRoom = await this.roomRepository.findByUsers(user.id, recipientId);
    if (existingRoom) {
      return existingRoom.chatroomName;
    }

    // 새로운 방 생성
    const roomName = uuidv4();
    const room = new ChatRoom();
    room.chatroomName = roomName;
    room.user = [user, recipient];

    await this.roomRepository.createRoom(room);
    return roomName;
  }

  /**
   * 메시지 저장
   * @param user 메시지 전송자
   * @param roomId 방 ID
   * @param content 메시지 내용
   * @returns 저장된 메시지 객체
   */
  async saveMessage(user: User, roomId: number, content: string) {
    if (!content || content.trim() === '') {
      throw new CustomWsException('메시지 내용이 비어 있습니다.');
    }

    // 방 유효성 검사
    const room = await this.roomRepository.findById(roomId);
    if (!room) {
      throw new CustomWsException('존재하지 않는 방입니다.');
    }

    // 메시지 생성
    const message = new Message();
    message.sender = user.id;
    message.content = content;
    message.chatroom = room;
    message.timestamp = new Date();

    const savedMessage = await this.messageRepository.saveMessage(message);
    if (!savedMessage) {
      throw new CustomWsException('메시지 저장에 실패했습니다.');
    }

    // Redis에 메시지 푸시
    const senderName = await this.userService.findUserNameById(user.id);
    await this.redisService.publish(
      'chat_channel',
      JSON.stringify({
        sender: senderName,
        content: savedMessage.content,
        room: savedMessage.chatroom.chatroomName,
        read: false,
      }),
    );

    return {
      sender: senderName,
      content: savedMessage.content,
      room: savedMessage.chatroom.chatroomName,
      read: false,
    };
  }

  /**
   * 방의 메시지 조회
   * @param roomName 방 이름
   * @returns 메시지 리스트
   */
  async findRoomMessages(roomName: string): Promise<any[]> {
    // 방 유효성 검사
    const room = await this.roomRepository.findByName(roomName);
    if (!room) {
      throw new CustomWsException('해당 방이 존재하지 않습니다.');
    }

    // 방에 속한 메시지 찾기
    const messages = await this.messageRepository.findMessagesByRoom(room.chatroomId);
    if (!messages.length) {
      throw new CustomWsException('해당 방에 메시지가 없습니다.');
    }

    // 메시지의 사용자 이름 조회 및 변환
    return Promise.all(
      messages.map(async (msg) => ({
        sender: await this.userService.findUserNameById(msg.sender),
        content: msg.content,
        read: msg.read || false,
      })),
    );
  }
}
