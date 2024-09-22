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
 * 2024.09.22    김재영      Modified    replyCount는 DTO에서 계산하여 처리할 수 있도록 변경
 */

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Community } from '@_modules/community/entities/community.entity';
import { User } from '@_modules/user/entity/user.entity';

@Entity('comment')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  content: string;

  @Column({ nullable: true })
  parentId?: number | null;

  @Column()
  postId: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => Community, (community) => community.comments, { onDelete: 'CASCADE' })
  community: Community;

  @ManyToOne(() => Comment, (comment) => comment.replies, { nullable: true, onDelete: 'CASCADE' })
  parent?: Comment;

  @OneToMany(() => Comment, (comment) => comment.parent)
  replies?: Comment[];

  @ManyToOne(() => User, (user) => user.comments, { eager: false })
  user: User;
}
