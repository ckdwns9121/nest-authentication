import { Module } from '@nestjs/common';
import { LicenseKeyService } from './license-key.service';
import { LicenseKeyController } from './license-key.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LicenseKey } from './license-key.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([LicenseKey]), AuthModule],
  providers: [LicenseKeyService],
  controllers: [LicenseKeyController],
})
export class LicenseKeyModule {}
