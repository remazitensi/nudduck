/**
 * File Name    : ai-chat.entity.ts
 * Description  : ai-chat 엔티티
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.13    이승철      Created
 */

import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AIChatSession {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column({ nullable: true })
  topic: string;

  @CreateDateColumn()
  createdAt: Date;
}

@Entity()
export class AIChatMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sessionId: number;

  @Column()
  message: string;

  @Column()
  sender: 'user' | 'ai';

  @CreateDateColumn()
  createdAt: Date;
}
