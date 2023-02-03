import { Controller, Get } from '@nestjs/common';
import { Public } from 'src/auth/auth.decorator';
import { SmsService } from './sms.service';

@Controller('sms')
export class SmsController {
  constructor(private smsService: SmsService) {}

  @Public()
  @Get()
  test() {
    return this.smsService.sendSMS('01072055570');
  }
}
