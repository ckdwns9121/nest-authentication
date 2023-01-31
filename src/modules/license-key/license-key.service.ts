import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LicenseKey } from './license-key.entity';

@Injectable()
export class LicenseKeyService {
  constructor(
    @InjectRepository(LicenseKey)
    private licenseKeyRepository: Repository<LicenseKey>,
  ) {}
}
