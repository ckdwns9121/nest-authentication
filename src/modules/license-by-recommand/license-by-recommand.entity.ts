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

  @OneToOne(() => LicenseKey, (license) => license.license_key)
  licenseKey: string;

  @ManyToOne(() => User, (user) => user.licenseByRecommand)
  user: User;
}
