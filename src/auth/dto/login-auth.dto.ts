import { PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';

export class LoginAuthDto extends PickType(CreateUserDto, [
  'id',
  'password',
] as const) {}
