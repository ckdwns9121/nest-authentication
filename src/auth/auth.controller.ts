import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Public } from './auth.decorator';
import { UserService } from 'src/modules/user/user.service';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { SmsService } from 'src/sms/sms.service';
import { CertificationDto, SmsDto } from 'src/sms/dto/sms.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private smsService: SmsService,
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req) {
    const access_token = this.authService.login(req.user);
    const refresh_token = this.authService.refreshToken(req.user);
    await this.userService.setCurrentRefreshToken(refresh_token, req.user.id);
    return {
      access_token,
      refresh_token,
    };
  }

  @Public()
  @Post('register')
  async registerAccount(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.userService.registerUser(createUserDto);
  }

  @Public()
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  refresh(@Req() req) {
    const access_token = this.authService.login(req.user);
    return { access_token };
  }

  @Post('test')
  test(@Req() req) {
    console.log('test');
    return '유효한 토큰';
  }

  @Public()
  @Post('sms')
  async certificationNumber(@Body(ValidationPipe) smsDto: SmsDto) {
    return this.smsService.sendSMS(smsDto.phone_number);
  }

  @Public()
  @Post('certification')
  async checkCertificationNumber(
    @Body(ValidationPipe) certificationDto: CertificationDto,
  ) {
    const { phone_number, certification } = certificationDto;
    return this.smsService.checkAuthNumber(phone_number, certification);
  }
}
