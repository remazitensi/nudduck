/**
 * File Name    : comment.entity.ts
 * Description  : 댓글 엔티티
 * Author       : 김재영
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.09    김재영      Created     댓글 엔티티 초기 생성
 * 2024.09.10    김재영      Modified    typeorm 추가
 * 2024.09.13    김재영      Modified    대댓글 개수 추가
 * 2024.09.17    김재영      Modified    주석 업데이트 및 설명 추가
 */

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Community } from './community.entity';

@Entity('comment') // 테이블 이름 지정
export class Comment {
  @PrimaryGeneratedColumn() // 자동 생성되는 PK
  commentId: number;

  @Column('text') // 긴 텍스트를 위한 컬럼
  content: string; // 댓글 내용

  @Column({ nullable: true }) // nullable로 대댓글이 아닐 경우 null 허용
  parentId?: number | null; // 상위 댓글의 ID (대댓글일 경우)

  @Column() // 사용자 ID
  userId: number;

  @Column() // 게시글 ID
  postId: number;

  @CreateDateColumn({ type: 'timestamp' }) // 자동 생성되는 생성일 컬럼
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' }) // 자동 수정되는 수정일 컬럼
  updatedAt: Date;

  // 댓글이 속한 커뮤니티 게시글
  @ManyToOne(() => Community, (community) => community.comments, { onDelete: 'CASCADE' })
  community: Community;

  // 부모 댓글
  @ManyToOne(() => Comment, (comment) => comment.replies, { nullable: true, onDelete: 'CASCADE' })
  parent?: Comment;

  // 대댓글 배열 (self-referencing relationship)
  @OneToMany(() => Comment, (comment) => comment.parent)
  replies?: Comment[];

  // 대댓글 개수 계산
  repleyCount?: number; // 실제로 DB에 저장되지 않고, 조회할 때 계산
}
