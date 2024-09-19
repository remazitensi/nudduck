import { Injectable } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../chat/entities/message.entity';
import { ChatRoom } from '../chat/entities/chat-room.entity';
import { v4 as uuidv4 } from 'uuid';
import { WsException } from '@nestjs/websockets';
import { RedisService } from '../redis/redis.service';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';

// 커스텀 예외 클래스
export class CustomWsException extends WsException {
  constructor(message: string) {
    super(message);
  }
}

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatRoom) private readonly roomRepository: Repository<Room>,
    @InjectRepository(Message) private readonly messageRepository: Repository<Message>,
    private readonly userService: UserService,
    private readonly redisService: RedisService,
  ) {}

  // 1대1 방 생성 로직
  async createRoom(user: User, recipientId: number): Promise<string> {
    try {
      const foundUser = await this.userService.findUserById(user.id);
      const recipient = await this.userService.findUserById(recipientId);

      if (!foundUser || !recipient) {
        throw new CustomWsException('사용자가 존재하지 않습니다.');
      }

      // 기존 방이 있는지 확인
      const foundRoom = await this.findExistRoom(user.id, recipientId);

      if (foundRoom) {
        return foundRoom;
      }

      // 새 방 생성
      const roomName = uuidv4();
      const room = new Room();
      room.name = roomName;
      room.users = [user, recipient];
      await this.roomRepository.save(room);

      return room.name;
    } catch (error) {
      throw error;
    }
  }

  // 메시지 전송 로직
  async saveMessage(user: User, roomId: number, content: string) {
    // 메시지 유효성 검사 추가
    if (!content || content.trim() === '') {
      throw new CustomWsException('메시지 내용이 비어 있을 수 없습니다.');
    }

    try {
      const message = new Message();
      message.sender = user.id;
      message.content = content;
      message.room = { id: roomId } as Room; // Room 객체를 설정
      message.timestamp = new Date(); // 현재 타임스탬프 저장

      const savedMessage = await this.messageRepository.save(message);
      if (!savedMessage) {
        throw new CustomWsException('메시지 생성에 실패했습니다.');
      }

      // Redis에 메시지 푸시
      await this.redisService.publish(
        'chat_channel',
        JSON.stringify({
          sender: await this.userService.findUserNameById(user.id),
          content: savedMessage.content,
          room: savedMessage.room.name,
          read: false, // 읽음 상태 추가
        }),
      );

      return {
        sender: await this.userService.findUserNameById(user.id),
        content: savedMessage.content,
        room: savedMessage.room.name,
        read: false, // 읽음 상태 추가
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * 방 존재 여부 확인
   * @param userId 사용자 ID
   * @param recipientId 수신자 ID
   * @returns 방의 이름 또는 null
   *
   * TODO:
   * - 방 존재 확인 쿼리 검토 및 성능 최적화
   * - 방 이름 반환 로직 검토
   */
  private async findExistingRoom(userId: number, recipientId: number): Promise<string | null> {
    try {
      const room = await this.roomRepository
        .createQueryBuilder('room')
        .innerJoin('room.users', 'u1', 'u1.id = :userId', { userId })
        .innerJoin('room.users', 'u2', 'u2.id = :recipientId', { recipientId })
        .select('room.name')
        .getOne();

      return room ? room.name : null;
    } catch (error) {
      throw error;
    }
  }

  /**
   * 방의 메시지 조회
   * @param roomName 방 이름
   * @returns 메시지 리스트
   *
   * TODO:
   * - 메시지 조회 쿼리 검토 및 성능 최적화
   * - 사용자 닉네임 조회 로직 검토
   */
  async findRoomMessages(roomName: string): Promise<any[]> {
    try {
      const room = await this.roomRepository.findOne({ where: { name: roomName } });
      if (!room) {
        throw new CustomWsException('방이 존재하지 않습니다.');
      }

      // 필요한 필드만 선택하여 최적화
      const messages = await this.messageRepository.createQueryBuilder('message').where('message.roomId = :roomId', { roomId: room.id }).orderBy('message.timestamp', 'DESC').limit(50).getMany();

      if (!messages.length) {
        throw new CustomWsException('메시지가 없습니다.');
      }

      return Promise.all(
        messages.map(async (msg) => ({
          sender: await this.userService.findUserNameById(msg.sender),
          content: msg.content,
          read: msg.read || false, // 읽음 상태 추가
        })),
      );
    } catch (error) {
      throw error;
    }
  }
}
