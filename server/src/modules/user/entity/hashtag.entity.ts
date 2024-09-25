/**
 * File Name    : hashtag.entity.ts
 * Description  : 해시태그 엔티티 설정
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.16    이승철      Created
 * 2024.09.24    이승철      Modified    카멜케이스로 변경
 */

import { User } from '@_modules/user/entity/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserHashtag {
  @PrimaryGeneratedColumn()
  hashtagId: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string;

  @ManyToOne(() => User, (user) => user.hashtags)
  @JoinColumn({ name: 'userId' })
  user: User;
}
