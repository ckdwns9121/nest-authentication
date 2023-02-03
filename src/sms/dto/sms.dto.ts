import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class SmsDto {
  @IsNotEmpty()
  @IsPhoneNumber('KR', {})
  phone_number!: string;
}

export class CertificationDto {
  @IsNotEmpty()
  @IsPhoneNumber('KR', {})
  phone_number!: string;

  @IsNotEmpty()
  @IsString()
  certification!: string;
}
