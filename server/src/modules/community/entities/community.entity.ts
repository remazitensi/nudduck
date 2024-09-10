/**
 * File Name    : community.entity.ts
 * Description  : 커뮤니티 게시글 엔티티
 * Author       : 김재영
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.08    김재영      Created     커뮤니티 게시글 엔티티 초기 생성
 * 2024.09.09    김재영      Modified    게시글 속성 및 설명 추가
 */

import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Category } from '../enums/category.enum';
import { Comment } from './comment.entity';

@Entity('community') // 테이블 이름 지정
export class Community {
  @PrimaryGeneratedColumn() // 자동 생성되는 PK
  post_id: number;

  @Column() // 기본 문자열 컬럼
  title: string;

  @Column('text') // 긴 텍스트를 위한 컬럼
  content: string;

  @Column() // 사용자 ID
  user_id: number;

  @Column({ type: 'enum', enum: Category, nullable: true }) // enum을 사용한 카테고리 컬럼
  category?: Category;

  @CreateDateColumn({ type: 'timestamp' }) // 자동 생성되는 생성일 컬럼
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' }) // 자동 수정되는 수정일 컬럼
  updated_at: Date;

  @Column({ default: 0 }) // 기본값 0인 좋아요 수
  likes_count: number;

  @Column({ default: 0 }) // 기본값 0인 조회 수
  views_count: number;

  @Column({ default: 0 }) // 기본값 0인 댓글 수
  comments_count: number;

  @OneToMany(() => Comment, (comment) => comment.community, { cascade: true }) // 일대다 관계
  comments?: Comment[];
}
