import { IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class SmsDto {
  @IsNotEmpty()
  @IsPhoneNumber('KR', {})
  phone_number!: string;
}
