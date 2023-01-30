import { Exclude } from 'class-transformer';
import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Recommand } from '../recommand/redommand.entity';
import { LicenseKey } from './../license-key/license-key.entity';
import { LicenseByRecommand } from './../license-by-recommand/license-by-recommand.entity';

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

  @Column({ nullable: true })
  @Exclude()
  currentHashedRefreshToken?: string;

  // 유저는 한명의 추천인만 가질 수 있습니다.
  @OneToOne(() => Recommand, (recommand) => recommand.operator)
  operator: Recommand;

  // 유저는 여러명의 피추천인을 가질 수 있습니다.
  @OneToMany(() => Recommand, (recommand) => recommand.operands, {
    eager: true,
  })
  operands: Recommand[];

  // 유저는 한개의 라이센스 키를 가질 수 있다.
  @OneToOne(() => LicenseKey, (license) => license.user)
  license_key: LicenseKey;

  // 유저는 여러개의 추천인 이벤트를 등록할 수 있다.
  @OneToMany(
    () => LicenseByRecommand,
    (licenseByRecommand) => licenseByRecommand.id,
  )
  licenseByRecommand: LicenseByRecommand[];
}
