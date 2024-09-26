/**
 * File Name    : expert.entity.ts
 * Description  : 전문가 엔티티 설정
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.14    이승철      Created
 */

import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Expert {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: '전문가의 고유 ID' })
  id: number;

  @Column()
  @ApiProperty({ description: '전문가 이름' })
  name: string;

  @Column()
  @ApiProperty({ description: '전문가 직책' })
  jobTitle: string;

  @Column()
  @ApiProperty({ description: '전문가 나이' })
  age: number;

  @Column('text')
  @ApiProperty({ description: '전문가 자기소개' })
  bio: string;

  @Column({ nullable: true })
  @ApiProperty({ description: '프로필 이미지 URL', required: false })
  profileImage: string;

  @Column()
  @ApiProperty({ description: '전문가 이메일' })
  email: string;

  @Column({ nullable: true })
  @ApiProperty({ description: '전문가 전화번호', required: false })
  phone: string;

  @Column('int')
  @ApiProperty({ description: '상담 비용' })
  cost: number;

  @Column()
  @ApiProperty({ description: '전문가 해시태그' })
  hashtags: string;
}
