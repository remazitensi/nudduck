import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from '@_modules/community/enums/category.enum';
import { Comment } from '@_modules/community/entities/comment.entity';
import { User } from '@_modules/user/entity/user.entity';

@Entity('community') // 테이블 이름 지정
export class Community {
  @PrimaryGeneratedColumn() // 자동 생성되는 PK
  postId: number;

  @Column() // 기본 문자열 컬럼
  title: string;

  @Column('text') // 긴 텍스트를 위한 컬럼
  content: string;

  @Column({ type: 'enum', enum: Category, nullable: true }) // enum을 사용한 카테고리 컬럼
  category?: Category;

  @CreateDateColumn({ type: 'timestamp' }) // 자동 생성되는 생성일 컬럼
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' }) // 자동 수정되는 수정일 컬럼
  updatedAt: Date;

  @Column({ default: 0 }) // 기본값 0인 조회 수
  viewCount: number;

  @Column({ default: 0 }) // 기본값 0인 댓글 수
  commentCount: number;

  @OneToMany(() => Comment, (comment) => comment.community, { cascade: true }) // 일대다 관계
  comments?: Comment[]; // 댓글이 없을 수 있으므로 nullable 설정

  @ManyToOne(() => User, (user) => user.communities, { eager: false, onDelete: 'CASCADE', nullable: false }) // 유저와의 관계 추가
  @JoinColumn({ name: 'userId' }) // 외래 키 컬럼을 명시적으로 지정
  user: User;
}
