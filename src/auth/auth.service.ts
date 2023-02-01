import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/user/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(id: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new UnauthorizedException('User does not exist.');
    }

    const passwordCompare = await bcrypt.compare(password, user.password);

    // 비밀번호가 일치한다면
    if (passwordCompare) {
      // 비밀번호를 뺀 유저정보를 리턴
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } else {
      throw new UnauthorizedException('Please check your ID or password.');
    }
  }

  /**
   * 로그인 함수.
   * @return access_token
   */
  login(jwtPayload: User) {
    const payload = { id: jwtPayload.id, sub: jwtPayload.user_id };
    console.log(payload);
    const access_token = this.jwtService.sign(payload, {
      secret: jwtConstants.secret,
      expiresIn: '1h',
    });
    return access_token;
  }

  /**
   * 리프레쉬 함수.
   * @return refresh_token
   */
  refreshToken(jwtPayload: any) {
    const payload = { id: jwtPayload.id, sub: jwtPayload.user_id };
    const refresh_token = this.jwtService.sign(payload, {
      secret: jwtConstants.refresh_secret,
      expiresIn: '30d',
    });
    return refresh_token;
  }
}
