import { Module } from '@nestjs/common';
import { LicenseByOrderService } from './license-by-order.service';
import { LicenseByOrderController } from './license-by-order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LicenseByOrder } from './license-by-order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LicenseByOrder])],
  providers: [LicenseByOrderService],
  controllers: [LicenseByOrderController],
})
export class LicenseByOrderModule {}
