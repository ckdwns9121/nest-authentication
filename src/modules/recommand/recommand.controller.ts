import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Public } from 'src/auth/auth.decorator';
import { RecommandService } from './recommand.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('recommand')
export class RecommandController {
  constructor(private recommandService: RecommandService) {}

  // 나를 추천인으로 등록한 사람
  @Public()
  @Get()
  getRecommandUsers() {
    return 'this will return recommand';
  }

  // 추천인 등록
  @UseGuards(JwtAuthGuard)
  @Post()
  createRecommand() {
    return 'this will return create recommand';
  }
}
