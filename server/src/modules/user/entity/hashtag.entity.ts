/**
 * File Name    : hashtag.entity.ts
 * Description  : 해시태그 엔티티 설정
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.16    이승철      Created
 */

import { User } from '@_modules/user/entity/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserHashtag {
  @PrimaryGeneratedColumn()
  hashtag_id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string;

  @ManyToOne(() => User, (user) => user.hashtags)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
