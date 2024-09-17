/**
 * File Name    : user.entity.ts
 * Description  : 유저 엔티티 설정
 * Author       : 이승철
 *
 * History
 * Date          Author      Status      Description
 * 2024.09.07    이승철      Created
 * 2024.09.07    이승철      Modified    유저 엔티티 설정
 * 2024.09.08    이승철      Modified    nickName 추가
 * 2024.09.10    이승철      Modified    @DeleteDateColumn() 으로 변경
 * 2024.09.16    이승철      Modified    절대경로 변경, 해시태그에 OneToMany decorator 적용
 * 2024.09.16    이승철      Modified    인생그래프, 인생그래프 즐겨찾기 적용
 */

import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn, JoinColumn } from 'typeorm';
import { UserHashtag } from '@_modules/user/entity/hashtag.entity';
import { LifeGraph } from '@_modules/life-graph/entity/life-graph.entity';

@Entity()
@Unique(['provider', 'provider_id'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  provider: string;

  @Column({ type: 'varchar', length: 255 })
  provider_id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  nickname: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  refresh_token: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  image_url: string;

  @OneToMany(() => UserHashtag, (userHashtag) => userHashtag.user)
  hashtags: UserHashtag[];

  // 즐겨찾기한 인생 그래프와의 관계 (유저는 하나의 인생 그래프만 즐겨찾기 가능)
  @ManyToOne(() => LifeGraph)
  @JoinColumn({ name: 'favorite_life_graph_id' })
  favorite_life_graph: LifeGraph;

  // 유저가 작성한 인생 그래프들과의 관계
  @OneToMany(() => LifeGraph, (lifeGraph) => lifeGraph.user)
  life_graphs: LifeGraph[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date | null;
}
