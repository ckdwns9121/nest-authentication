import { Controller, Get, Post, Req, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Public } from './auth.decorator';
import { UserService } from 'src/modules/user/user.service';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async login(@Req() req) {
    console.log(req);
    const access_token = this.authService.login(req.user);
    const refresh_token = this.authService.refreshToken(req.user);

    await this.userService.setCurrentRefreshToken(refresh_token, req.user.id);
    return {
      access_token,
      refresh_token,
    };
  }

  @Public()
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  refresh(@Req() req) {
    const access_token = this.authService.login(req.user);
    return { access_token };
  }

  @UseGuards(JwtAuthGuard)
  @Post('test')
  test(@Req() req) {
    console.log('test');
    console.log(req);
  }
}
