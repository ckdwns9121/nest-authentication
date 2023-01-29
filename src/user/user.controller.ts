import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Get(':id')
  async getUserInfo(@Param() id: string) {
    return this.userService.getById(id);
  }

  @Post('signup')
  async signUp(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    console.log(createUserDto);
    return this.userService.signup(createUserDto);
  }
}
