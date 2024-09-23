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
 * 2024.09.19    김재영      Modified    커뮤니티 적용
 * 2024.09.23    김재영      Modified    채팅 기능 적용
 * 2024.09.24    이승철      Modified    카멜케이스로 변경
 */

import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn, JoinColumn } from 'typeorm';
import { UserHashtag } from '@_modules/user/entity/hashtag.entity';
import { LifeGraph } from '@_modules/life-graph/entity/life-graph.entity';
import { Community } from '@_modules/community/entities/community.entity';
import { Comment } from '@_modules/community/entities/comment.entity';
import { ChatRoom } from '@_modules/chat/entities/room.entity';
import { Message } from '@_modules/chat/entities/message.entity';

@Entity()
@Unique(['provider', 'providerId'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  provider: string;

  @Column({ type: 'varchar', length: 255 })
  providerId: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  nickname: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  refreshToken: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  imageUrl: string;

  @OneToMany(() => UserHashtag, (userHashtag) => userHashtag.user)
  hashtags: UserHashtag[];

  // 즐겨찾기한 인생 그래프와의 관계 (유저는 하나의 인생 그래프만 즐겨찾기 가능)
  @ManyToOne(() => LifeGraph)
  @JoinColumn({ name: 'favoriteLifeGraphId' })
  favoriteLifeGraph: LifeGraph;

  // 유저가 작성한 인생 그래프들과의 관계
  @OneToMany(() => LifeGraph, (lifeGraph) => lifeGraph.user)
  lifeGraphs: LifeGraph[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => Community, (community) => community.user)
  communities: Community[];

  // 유저가 참여한 채팅방들과의 관계 (다대다 관계로, 한 유저가 여러 채팅방에 참여 가능)
  @OneToMany(() => ChatRoom, (chatRoom) => chatRoom.createdBy)
  chatRooms: ChatRoom[];

  // 유저가 전송한 메시지들과의 관계
  @OneToMany(() => Message, (message) => message.user)
  messages: Message[];
}
