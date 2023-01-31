import { Exclude } from 'class-transformer';
import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { Recommand } from '../recommand/redommand.entity';
import { LicenseKey } from './../license-key/license-key.entity';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  user_id!: string;

  @Column({ unique: true, name: 'id' })
  id!: string;

  @Column({ name: 'password' })
  password!: string;

  @Column({ type: 'varchar', length: 40, unique: true, name: 'phone_number' })
  phone_number!: string;

  @Column({ default: false, name: 'marketing_reception' })
  marketing_reception!: boolean;

  @Column({ type: 'datetime', nullable: true })
  plan_started_at!: Date | null;

  @CreateDateColumn({ type: 'datetime', name: 'created_at' })
  created_at!: Date;

  @Column({ nullable: true, name: 'currentHashedRefreshToken' })
  @Exclude()
  currentHashedRefreshToken?: string;

  // 유저는 한명의 추천인만 가질 수 있습니다.
  @OneToOne(() => Recommand, (recommand) => recommand.operator)
  operator: Recommand;

  // 유저는 여러명의 피추천인을 가질 수 있습니다.
  @OneToMany(() => Recommand, (recommand) => recommand.operands, {
    eager: true,
  })
  operands: any[];

  // 유저는 한개의 라이센스 키를 가질 수 있다.
  @OneToMany(() => LicenseKey, (license) => license.user, { eager: true })
  license_key: LicenseKey;
}
