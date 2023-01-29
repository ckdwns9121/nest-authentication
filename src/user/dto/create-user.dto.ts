import {
  IsOptional,
  IsNotEmpty,
  IsBoolean,
  IsPhoneNumber,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  id!: string;

  @IsNotEmpty()
  password!: string;

  @IsNotEmpty()
  @IsPhoneNumber('KR', {})
  phone_number!: string;

  @IsBoolean()
  @IsOptional()
  marketing_reception?: boolean;
}
