import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  BaseEntity,
} from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  user_id!: string;

  @Column({ unique: true })
  id!: string;

  @Column()
  password!: string;

  @Column({ type: 'varchar', length: 40, unique: true })
  phone_number!: string;

  @Column({ default: false })
  marketing_reception!: boolean;

  @Column({ type: 'datetime', nullable: true })
  plan_started_at!: Date | null;

  @CreateDateColumn({ type: 'datetime' })
  created_at!: Date;
}
