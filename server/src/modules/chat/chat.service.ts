import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../chat/entities/message.entity';
import { ChatRoom } from '../chat/entities/chat-room.entity';
import { v4 as uuidv4 } from 'uuid';
import { WsException } from '@nestjs/websockets';
import dayjs from 'dayjs';
//import { UserService } from '../user/user.service';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatRoom) private readonly roomRepository: Repository<Room>,
    @InjectRepository(Message) private readonly messageRepository: Repository<Message>,
    private readonly userService: UserService, // 사용자 서비스 주입
  ) {}

  /**
   * 1대1 채팅방 생성
   * @param user 현재 사용자
   * @param recipientId 수신자 ID
   * @returns 생성된 방의 이름
   *
   * TODO:
   * - 사용자 존재 확인을 위해 UserService의 메서드 사용 여부 검토
   * - 방 생성 시 중복 방 확인 로직 확인 및 개선
   */
  async createRoom(user: any, recipientId: number): Promise<string> {
    try {
      // 사용자 존재 확인
      const foundUser = await this.userService.findUserbyId(user.id);
      const recipient = await this.userService.findUserbyId(recipientId);

      if (!foundUser || !recipient) {
        throw new WsException('사용자가 존재하지 않습니다.');
      }

      // 기존 방 확인
      const existingRoomName = await this.findExistingRoom(user.id, recipientId);
      if (existingRoomName) {
        return existingRoomName;
      }

      // 새 방 생성
      const roomName = uuidv4();
      const newRoom = this.roomRepository.create({ name: roomName });
      await this.roomRepository.save(newRoom);

      return roomName;
    } catch (error) {
      throw error;
    }
  }

  /**
   * 메시지 저장
   * @param user 현재 사용자
   * @param roomId 방 ID
   * @param content 메시지 내용
   * @returns 저장된 메시지 정보
   *
   * TODO:
   * - 메시지 저장 로직 검토 및 성능 최적화
   * - 메시지 저장 실패 시의 예외 처리 추가
   */
  async saveMessage(user: any, roomId: number, content: string) {
    try {
      const userId = user.id;
      const timestamp = dayjs().format('YYYY-MM-DD HH:mm:ss');

      const message = this.messageRepository.create({
        sender: userId,
        content,
        room: { id: roomId }, // Room과의 관계 설정
        timestamp,
      });

      const savedMessage = await this.messageRepository.save(message);
      if (!savedMessage) {
        throw new WsException('메시지 저장 실패');
      }

      const senderName = await this.userService.findUserNameById(userId);

      return {
        sender: senderName,
        content: savedMessage.content,
        timestamp: savedMessage.timestamp,
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
        .innerJoin('room.participants', 'p1', 'p1.userId = :userId', { userId })
        .innerJoin('room.participants', 'p2', 'p2.userId = :recipientId', { recipientId })
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
      const messages = await this.messageRepository.createQueryBuilder('message').where('message.room = :roomName', { roomName }).orderBy('message.timestamp', 'DESC').limit(50).getMany();

      if (!messages.length) {
        throw new WsException('메시지가 없습니다.');
      }

      return Promise.all(
        messages.map(async (msg) => {
          const senderName = await this.userService.findUserNameById(msg.sender);
          return {
            sender: senderName,
            content: msg.content,
            timestamp: msg.timestamp,
          };
        }),
      );
    } catch (error) {
      throw error;
    }
  }
}
