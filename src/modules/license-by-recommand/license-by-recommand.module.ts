import { Module } from '@nestjs/common';
import { LicenseByRecommandController } from './license-by-recommand.controller';
import { LicenseByRecommandService } from './license-by-recommand.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LicenseByRecommand } from './license-by-recommand.entity';
import { UserModule } from '../user/user.module';
import { LicenseKeyModule } from '../license-key/license-key.module';
import { LicenseKey } from '../license-key/license-key.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([LicenseByRecommand, LicenseKey]),
    UserModule,
    LicenseKeyModule,
  ],
  controllers: [LicenseByRecommandController],
  providers: [LicenseByRecommandService],
})
export class LicenseByRecommandModule {}
