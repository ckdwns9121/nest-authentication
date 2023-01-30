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

  async test(id: string): Promise<any> {
    // console.log('here');
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .getOne();
    return user;
  }

  async getById(id: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    return user;
  }

  async setCurrentRefreshToken(refreshToken: string, id: string) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    const user = await this.getById(id);
    user.currentHashedRefreshToken = currentHashedRefreshToken;
    await this.userRepository.save(user);
    // await this.userRepository.update(id, { currentHashedRefreshToken });
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, id: string) {
    const user = await this.getById(id);

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken,
    );

    if (isRefreshTokenMatching) {
      return user;
    }
  }

  async removeRefreshToken(id: string) {
    const user = await this.getById(id);
    user.currentHashedRefreshToken = null;
    return await this.userRepository.save(user);
    // return this.userRepository.update(id, {
    //   currentHashedRefreshToken: null,
    // });
  }

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
    console.log('유저 생성 완료');

    return await this.userRepository.save(user);
  }
}
