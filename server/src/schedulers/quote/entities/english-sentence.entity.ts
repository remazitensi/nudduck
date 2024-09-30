/*
 * File Name    : english-sentence.entity.ts
 * Description  : 영문장 DTO
 * Author       : 김재영
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.23    김재영      Created     영문장 엔티티 생성
 */

import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('EnglishSentences')
export class EnglishSentence {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  english: string;

  @Column({ type: 'text' })
  korean: string;

  @Column({ type: 'text', nullable: true })
  note?: string;
}
