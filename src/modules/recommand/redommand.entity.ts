import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Recommand extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // 한사람 당 한 번의 추천 기회가 주어진다.
  @OneToOne(() => User, (user) => user.operator)
  @JoinColumn({ name: 'user_id' })
  operator: User;

  // 한사람은 여러명의 추천을 받을 수 있다.
  @ManyToOne(() => User, (user) => user.operands)
  operands: User;

  @CreateDateColumn({ comment: '추천일시' })
  create_at: Date;
}
