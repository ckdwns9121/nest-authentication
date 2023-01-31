import { Controller, Get, Post } from '@nestjs/common';
import { LicenseKeyService } from './license-key.service';

@Controller('license-key')
export class LicenseKeyController {
  constructor(private licenseKeyService: LicenseKeyService) {}

  @Get()
  getLicenseKey() {
    return 'this will be return licenseKey';
  }
  @Post()
  createLicenseKey() {
    return 'this will be create licenseKey';
  }
}
