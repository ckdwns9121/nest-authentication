import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthService) {
    // 내부에 필드 작성하는거 잊지말기
    // 문서 예시에는 안써있는데 안써주면 validate가 호출되지 않습니다.
    super({ usernameField: 'id', passwordField: 'password' });
  }

  async validate(id: string, password: string): Promise<any> {
    // 비밀번호를 뺀 유저정보를 리턴받음
    const user = await this.authService.validateUser(id, password);
    return user;
  }
}
