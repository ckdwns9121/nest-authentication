import { Controller, Get, Post } from '@nestjs/common';
import { Public } from 'src/auth/auth.decorator';
import { RecommandService } from './recommand.service';

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
  @Public()
  @Post()
  createRecommand() {
    return 'this will return create recommand';
  }
}
