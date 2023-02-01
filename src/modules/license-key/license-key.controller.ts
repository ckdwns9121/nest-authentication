import { Controller, Get, Post, Req } from '@nestjs/common';
import { LicenseKeyService } from './license-key.service';

@Controller('license-key')
export class LicenseKeyController {
  constructor(private licenseKeyService: LicenseKeyService) {}

  @Get()
  getLicenseKey() {
    return 'this will be return licenseKey';
  }
  @Post()
  createLicenseKey(@Req() req) {
    return this.licenseKeyService.create(req.user.user_id);
  }
}
