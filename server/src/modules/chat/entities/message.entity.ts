import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Room } from './room.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column() // 메시지의 송신자 ID
  sender: number;

  @Column() // 메시지 내용
  content: string;

  @Column() // 메시지 전송 시간
  timestamp: string;

  @ManyToOne(() => Room, (room) => room.messages)
  @JoinColumn({ name: 'roomId' })
  room: Room;
}
