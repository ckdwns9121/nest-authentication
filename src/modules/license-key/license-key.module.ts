import { Module } from '@nestjs/common';
import { LicenseKeyService } from './license-key.service';
import { LicenseKeyController } from './license-key.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LicenseKey } from './license-key.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LicenseKey])],
  providers: [LicenseKeyService],
  controllers: [LicenseKeyController],
})
export class LicenseKeyModule {}
