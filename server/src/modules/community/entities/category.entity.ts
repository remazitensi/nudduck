/**
 * File Name    : category.entity.ts
 * Description  : 카테고리 엔티티
 * Author       : 김재영
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.08    김재영      Created     카테고리 엔티티 초기 생성
 * 2024.09.09    김재영      Modified    커뮤니티 게시글과의 관계 추가
 * 2024.09.13    김재영      Modified    TypeORM 데코레이터 추가
 */

import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Community } from './community.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Community, (community) => community.category)
  communities: Community[];
}
