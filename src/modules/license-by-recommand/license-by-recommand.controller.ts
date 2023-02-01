import { Controller } from '@nestjs/common';
import { Body, Get, Post, Req } from '@nestjs/common/decorators';
import { LicenseByRecommandService } from './license-by-recommand.service';

@Controller('license-by-recommand')
export class LicenseByRecommandController {
  constructor(private licenseByRecommandService: LicenseByRecommandService) {}

  @Post()
  async check(@Req() req, @Body() data) {
    return this.licenseByRecommandService.check(req.user.user_id);
  }
}
