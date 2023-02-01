import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

export enum LicenseType {
  ACTIVE = 'ACTIVE',
  CANCEL = 'CANCEL',
}
@Entity()
export class LicenseKey extends BaseEntity {
  @PrimaryColumn()
  key: string;

  @CreateDateColumn({ type: 'datetime', name: 'create_at' })
  create_at: Date;

  @ManyToOne(() => User, (user) => user.license_key)
  user: User;

  @Column({
    type: 'enum',
    enum: LicenseType,
    nullable: false,
    default: LicenseType.ACTIVE,
    name: 'type',
  })
  type: LicenseType;
}
