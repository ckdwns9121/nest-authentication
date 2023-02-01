import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { LicenseKey } from './license-key.entity';
import { UserService } from './../user/user.service';
import { LicenseType } from './license-key.entity';

export function generateLicenseKey(length, pairs) {
  let result = '';
  const pair = pairs || 4;
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result.match(new RegExp(`.{1,${pair}}`, 'g')).join('-');
}

@Injectable()
export class LicenseKeyService {
  constructor(
    @InjectRepository(LicenseKey)
    private licenseKeyRepository: Repository<LicenseKey>,

    private userService: UserService,
  ) {}

  async create(user_id: string): Promise<LicenseKey> {
    const user: User = await this.userService.findOneByUserId(user_id);

    const key = generateLicenseKey(32, 4);

    const licenseKey = this.licenseKeyRepository.create({
      user,
      key,
      type: LicenseType.ACTIVE,
    });

    return await this.licenseKeyRepository.save(licenseKey);
  }

  async createEventLicense(user: User): Promise<LicenseKey> {
    const key = generateLicenseKey(32, 4);

    const licenseKey = this.licenseKeyRepository.create({
      user,
      key,
      type: LicenseType.ACTIVE,
    });

    return await this.licenseKeyRepository.save(licenseKey);
  }
}
