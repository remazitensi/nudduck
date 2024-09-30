import { Comment } from '@_modules/community/entities/comment.entity';
import { Category } from '@_modules/community/enums/category.enum';
import { User } from '@_modules/user/entity/user.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('community')
export class Community {
  @PrimaryGeneratedColumn()
  postId: number;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column({ type: 'enum', enum: Category, nullable: true })
  category?: Category;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @Column({ default: 0 })
  viewCount: number;

  @Column({ default: 0 })
  commentCount: number;

  // Lazy Loading 적용
  @OneToMany(() => Comment, (comment) => comment.community, { lazy: true, cascade: true })
  comments?: Promise<Comment[]>;

  @ManyToOne(() => User, (user) => user.communities, { eager: false, onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'userId' })
  user: User;
}
