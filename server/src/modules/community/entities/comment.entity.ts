/**
 * File Name    : comment.entity.ts
 * Description  : 댓글 엔티티
 * Author       : 김재영
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.09    김재영      Created     댓글 엔티티 초기 생성
 * 2024.09.10    김재영      Modified    typeorm 추가
 */

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Community } from './community.entity';

@Entity('comment') // 테이블 이름 지정
export class Comment {
  @PrimaryGeneratedColumn() // 자동 생성되는 PK
  comment_id: number;

  @Column('text') // 긴 텍스트를 위한 컬럼
  content: string; // 댓글 내용

  @Column({ nullable: true }) // nullable로 대댓글이 아닐 경우 null 허용
  parent_id?: number | null; // 상위 댓글의 ID (대댓글일 경우)

  @Column() // 사용자 ID
  user_id: number;

  @Column() // 게시글 ID
  post_id: number;

  @CreateDateColumn({ type: 'timestamp' }) // 자동 생성되는 생성일 컬럼
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' }) // 자동 수정되는 수정일 컬럼
  updated_at: Date;

  // 댓글이 속한 커뮤니티 게시글
  @ManyToOne(() => Community, (community) => community.comments, { onDelete: 'CASCADE' })
  community: Community;

  // 부모 댓글
  @ManyToOne(() => Comment, (comment) => comment.replies, { nullable: true, onDelete: 'CASCADE' })
  parent?: Comment;

  // 대댓글 배열 (self-referencing relationship)
  @OneToMany(() => Comment, (comment) => comment.parent)
  replies?: Comment[];
}
