import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../chat/entities/message.entity';
import { Room } from '../chat/entities/room.entity';
import { v4 as uuidv4 } from 'uuid';
import { WsException } from '@nestjs/websockets';
import dayjs from 'dayjs';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Room) private readonly roomRepository: Repository<Room>,
    @InjectRepository(Message) private readonly messageRepository: Repository<Message>,
    private readonly userService: UserService, // UserService는 여전히 필요
  ) {}

  private readonly logger = new Logger(ChatService.name);

  // 1대1 방 생성 로직
  async createRoom(user: User, recipientId: number): Promise<string> {
    // client 제거
    try {
      const foundUser = await this.userService.findUserbyId(user.id);
      const recipient = await this.userService.findUserbyId(recipientId);

      if (!foundUser || !recipient) {
        throw new WsException('사용자가 존재하지 않습니다.');
      }

      // 기존 방이 있는지 확인
      const foundRoom = await this.findExistRoom(user.id, recipientId);

      if (foundRoom) {
        this.logger.log(`기존 방 찾음: ${foundRoom}`);
        return foundRoom;
      }

      // 방이 없으면 새로 생성
      const roomName = uuidv4();
      this.logger.log(`새로운 방 이름: ${roomName}`);

      const room = await this.roomRepository.save({ name: roomName });
      this.logger.log(`방 생성 완료: ${room.name}`);

      return room.name;
    } catch (error) {
      throw error;
    }
  }

  // 메시지 전송 로직
  async saveMessage(user: User, roomId: number, roomName: string, content: string) {
    try {
      const userId = user.id;
      const timestamp = dayjs().format('YYYY-MM-DD HH:mm:ss'); // dayjs 사용

      // 메시지 저장
      const message = this.messageRepository.create({
        sender: userId,
        content,
        room: { id: roomId }, // Room과의 관계 설정
        timestamp,
      });

      const savedMessage = await this.messageRepository.save(message);

      if (!savedMessage) {
        throw new WsException('메시지 생성에 실패했습니다.');
      }

      const foundUserNickname = await this.userService.findUserNameById(userId);

      return {
        sender: foundUserNickname,
        content: savedMessage.content,
        timestamp: savedMessage.timestamp,
        room: roomName,
      };
    } catch (error) {
      throw error;
    }
  }

  // 방에 존재하는지 확인
  async findExistRoom(userId: number, recipientId: number): Promise<string | null> {
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

  // 방 메시지 가져오기
  async findRoomMessages(roomName: string): Promise<object[]> {
    try {
      const messages = await this.messageRepository.createQueryBuilder('message').where('message.room = :roomName', { roomName }).orderBy('message.timestamp', 'DESC').limit(50).getMany();

      if (!messages.length) {
        throw new WsException('메시지가 없습니다.');
      }

      const messageList = [];

      for (const msg of messages) {
        const sender = await this.userService.findUserNameById(msg.sender);

        messageList.push({
          sender,
          content: msg.content,
          timestamp: msg.timestamp,
        });
      }

      return messageList;
    } catch (error) {
      throw error;
    }
  }
}
