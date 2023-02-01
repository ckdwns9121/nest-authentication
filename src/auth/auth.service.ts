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
      throw new UnauthorizedException('가입된 회원이 아닙니다.');
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (passwordCompare) {
      // 비밀번호를 뺀 유저정보를 담은 객체를 리턴
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } else {
      throw new UnauthorizedException('아이디 혹은 비밀번호를 확인해주세요');
    }
  }

  login(jwtPayload: User) {
    const payload = { id: jwtPayload.id, sub: jwtPayload.user_id };
    console.log(payload);
    const access_token = this.jwtService.sign(payload, {
      secret: jwtConstants.secret,
      expiresIn: '1h',
    });
    return access_token;
  }

  refreshToken(jwtPayload: any) {
    const payload = { id: jwtPayload.id, sub: jwtPayload.user_id };
    const refresh_token = this.jwtService.sign(payload, {
      secret: jwtConstants.refresh_secret,
      expiresIn: '30d',
    });
    return refresh_token;
  }
}
