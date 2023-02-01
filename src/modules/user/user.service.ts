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

  /**
   * 고유키로 (PK) 유저정보 가져오기
   */
  async findOneByUserId(user_id: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ user_id });
    return user;
  }

  /**
   * 실제 유저 아이디로 유저 정보 가져오기
   */
  async findOneById(id: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    return user;
  }

  /**
   * 유저 리프레쉬 토큰 갱신
   */
  async setCurrentRefreshToken(
    refreshToken: string,
    id: string,
  ): Promise<User> {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    const user = await this.findOneById(id);
    user.currentHashedRefreshToken = currentHashedRefreshToken;
    return await this.userRepository.save(user);
    // await this.userRepository.update(id, { currentHashedRefreshToken });
  }

  /**
   * 유저 리프레쉬 토큰 찾기
   */
  async getUserIfRefreshTokenMatches(refreshToken: string, id: string) {
    const user = await this.findOneById(id);

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken,
    );

    if (isRefreshTokenMatching) {
      return user;
    }
  }

  /**
   * 로그아웃 시 리프레쉬 토큰을 DB에서 삭제
   */
  async removeRefreshToken(id: string): Promise<User> {
    const user = await this.findOneById(id);
    user.currentHashedRefreshToken = null;
    return await this.userRepository.save(user);
  }

  /**
   * 회원가입
   */
  async registerUser(createUserDto: CreateUserDto): Promise<User> {
    const { id } = createUserDto;

    // 이미 존재하는 아이디인지 체크
    const conflictId = await this.userRepository.findOneBy({ id });
    // 이미 존재하는 아이디라면 에러
    if (conflictId) {
      throw new ConflictException('Is already id');
    }

    const { phone_number } = createUserDto;
    const conflictPhone = await this.userRepository.findOneBy({
      phone_number: phone_number,
    });

    // 이미 존재하는 핸드폰 번호라면 에러
    if (conflictPhone) {
      throw new ConflictException('Is already phone_number');
    }

    // 패스워드를 bcrypt를 통해 암호화
    const { password, ...restProps } = createUserDto;
    const user = this.userRepository.create({
      password: await bcrypt.hash(password, 12),
      ...restProps,
    });

    return await this.userRepository.save(user);
  }
}
