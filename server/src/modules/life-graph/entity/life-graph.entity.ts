/**
 * File Name    : life-graph.entity.ts
 * Description  : 인생그래프 엔티티 설정
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.17    이승철      Created
 */

import { LifeGraphEvent } from '@_modules/life-graph/entity/life-graph-events.entity';
import { User } from '@_modules/user/entity/user.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class LifeGraph {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.life_graphs)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'int' })
  current_age: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @OneToMany(() => LifeGraphEvent, (event) => event.lifeGraph, { cascade: true })
  events: LifeGraphEvent[];

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
