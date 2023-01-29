import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async signup(createUserDto: CreateUserDto): Promise<User> {
    const { id } = createUserDto;
    const conflictId = await this.userRepository.findOneBy({ id });
    if (conflictId) {
      throw new ConflictException('Is already id');
    }

    const { phone_number } = createUserDto;
    const conflictPhone = await this.userRepository.findOneBy({
      phone_number: phone_number,
    });
    if (conflictPhone) {
      throw new ConflictException('Is already phone_number');
    }
    const { password, ...restProps } = createUserDto;
    const user = {
      password: await bcrypt.hash(password, 12),
      ...restProps,
    };
    return await this.userRepository.save(user);
  }
}
