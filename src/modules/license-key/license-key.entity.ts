import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { LicenseByRecommand } from './../license-by-recommand/license-by-recommand.entity';

export enum LicenseType {
  ACTIVE = 'ACTIVE',
  CANCEL = 'CANCEL',
}
@Entity()
export class LicenseKey extends BaseEntity {
  @PrimaryColumn()
  license_key: string;

  @CreateDateColumn({ type: 'datetime' })
  create_at: Date;

  @ManyToOne(() => User, (user) => user.license_key)
  user: User;

  @Column({ nullable: false, default: LicenseType.ACTIVE })
  type: LicenseType;
}
