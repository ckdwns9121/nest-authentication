import { Module } from '@nestjs/common';
import { LicenseKeyService } from './license-key.service';
import { LicenseKeyController } from './license-key.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LicenseKey } from './license-key.entity';
import { UserModule } from './../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([LicenseKey]), UserModule],
  providers: [LicenseKeyService],
  controllers: [LicenseKeyController],
  exports: [LicenseKeyService],
})
export class LicenseKeyModule {}
