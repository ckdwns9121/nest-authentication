import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { LicenseByRecommand } from './../license-by-recommand/license-by-recommand.entity';

@Entity()
export class LicenseKey extends BaseEntity {
  @PrimaryColumn()
  license_key: string;

  // 한 사람은 하나의 라이센스 키를 가질 수 있음
  @JoinColumn()
  @OneToOne(() => User, (user) => user.license_key)
  user: User;

  // @OneToOne(() => LicenseByRecommand, { nullable: true })
  // LicenseByRecommand: LicenseByRecommand | null;

  @CreateDateColumn({ type: 'datetime' })
  create_at: Date;

  // 추천인 이벤트 한번에 한 라이센스 키 생성 가능
  // 주문번호로 생성했을 수도 있으니 nullable: true
  @OneToOne(
    () => LicenseByRecommand,
    (licenseByRecommand) => licenseByRecommand.id,
    { nullable: true },
  )
  licenseByRecommand: LicenseByRecommand;
}
