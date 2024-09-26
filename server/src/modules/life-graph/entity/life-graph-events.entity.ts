/**
 * File Name    : life-graph-events.entity.ts
 * Description  : 인생그래프 이벤트 엔티티 설정
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.17    이승철      Created
 * 2024.09.18    이승철      Modified    이벤트 제목 추가
 * 2024.09.24    이승철      Modified    카멜케이스로 변경
 */

import { LifeGraph } from '@_modules/life-graph/entity/life-graph.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
@Unique(['lifeGraph', 'age'])
export class LifeGraphEvent {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => LifeGraph, (lifeGraph) => lifeGraph.events, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lifeGraphId' })
  lifeGraph: LifeGraph;

  @Column({ type: 'int' })
  age: number;

  @Column({ type: 'int' })
  score: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;  

  @Column({ type: 'varchar', length: 255 })
  description: string;
}
