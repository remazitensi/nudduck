import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { Message } from '../entities/message.entity';
import { CustomWsException } from '../chat/chat.service'; // 커스텀 예외 클래스 임포트

@Injectable()
export class MessageRepository extends Repository<Message> {
  constructor(private dataSource: DataSource) {
    super(Message, dataSource.createEntityManager());
  }

  // 특정 방에 속한 메시지들 찾기 (시간순 정렬)
  async findMessagesByRoom(roomId: number): Promise<Message[]> {
    return this.find({
      where: { room: { id: roomId } },
      order: { timestamp: 'ASC' }, // 메시지를 시간순으로 정렬
    });
  }

  // 메시지 저장하기
  async saveMessage(roomId: number, senderId: number, content: string): Promise<Message> {
    // 메시지 유효성 검사 추가
    if (!content || content.trim() === '') {
      throw new CustomWsException('메시지 내용이 비어 있을 수 없습니다.');
    }

    const message = new Message();
    message.room = { id: roomId } as any; // Room 객체를 설정
    message.sender = senderId;
    message.content = content;
    message.timestamp = new Date(); // 현재 타임스탬프 저장
    return this.save(message);
  }
}
