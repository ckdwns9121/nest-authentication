import { Module } from '@nestjs/common';
import { LicenseByOrderService } from './license-by-order.service';
import { LicenseByOrderController } from './license-by-order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LicenseByOrder } from './license-by-order.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([LicenseByOrder]), AuthModule],
  providers: [LicenseByOrderService],
  controllers: [LicenseByOrderController],
})
export class LicenseByOrderModule {}
