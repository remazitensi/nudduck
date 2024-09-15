import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Message } from './message.entity';

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  // Message와 One-to-Many 관계, 하나의 room에 여러 메시지가 속함
  @OneToMany(() => Message, (message) => message.room)
  messages: Message[];
}
