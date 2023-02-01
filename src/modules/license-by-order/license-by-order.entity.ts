import { LicenseKey } from '../license-key/license-key.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class LicenseByOrder extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // 한 주문당 하나의 라이센스 키만 생성 가능하다.
  @OneToOne(() => LicenseKey, (license) => license.key, { eager: true })
  licenseKey: string;

  // 유저는 여러개의 주문을 진행할 수 있다.
  @ManyToOne(() => User)
  user: User;

  @Column({ unique: true })
  order_id: string;
}
