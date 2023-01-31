import { Module } from '@nestjs/common';
import { LicenseByRecommandController } from './license-by-recommand.controller';
import { LicenseByRecommandService } from './license-by-recommand.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LicenseByRecommand } from './license-by-recommand.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([LicenseByRecommand]), AuthModule],
  controllers: [LicenseByRecommandController],
  providers: [LicenseByRecommandService],
})
export class LicenseByRecommandModule {}
