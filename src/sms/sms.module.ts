import { Module } from '@nestjs/common';
import { SmsService } from './sms.service';
import { SmsController } from './sms.controller';
import { ConfigModule } from '@nestjs/config';
import ncpSmsConfig from 'src/configs/ncp-sms.config';

@Module({
  imports: [ConfigModule.forFeature(ncpSmsConfig)],
  providers: [SmsService],
  controllers: [SmsController],
  exports: [SmsService],
})
export class SmsModule {}
