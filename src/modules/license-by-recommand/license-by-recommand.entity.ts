import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { LicenseKey } from './../license-key/license-key.entity';

@Entity()
export class LicenseByRecommand extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // 한 이벤트당 하나의 키만 생성 가능하다.
  @OneToOne(() => LicenseKey, (license) => license.license_key)
  licenseKey: string;

  // 유저는 여러개의 이벤트를 진행할 수 있다.
  @ManyToOne(() => User)
  user: User;
}
