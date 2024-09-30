/*
 * File Name    : quote.entity.ts
 * Description  : 영문장 DTO
 * Author       : 김재영
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.23    김재영      Created     명언 엔티티 생성
 */

import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Quotes')
export class Quote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  author: string;

  @Column({ type: 'text' })
  authorProfile: string;

  @Column({ type: 'text' })
  message: string;
}
