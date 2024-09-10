import { User } from '@_user/entity/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserHashtag {
  @PrimaryGeneratedColumn()
  hashtagId: number;

  @Column({ type: 'bigint', nullable: false })
  userId: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'userId' })
  user: User;
}
