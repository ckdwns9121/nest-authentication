import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

export enum LicenseStatus {
  ACTIVE = 'ACTIVE', // 활성
  PAUSE = 'PAUSE', //일시정지
  PENDING = 'PENDING', //일시정지 대기
  EXPIRED = 'EXPIRED', //만료
  CANCEL = 'CANCEL', // 취소
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
    enum: LicenseStatus,
    nullable: false,
    default: LicenseStatus.ACTIVE,
    name: 'type',
  })
  status: LicenseStatus;
}
