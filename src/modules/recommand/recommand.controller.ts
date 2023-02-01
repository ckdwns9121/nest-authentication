import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  ValidationPipe,
} from '@nestjs/common';
import { CreateRecommandDto } from './dto/create-recommand.dto';
import { RecommandService } from './recommand.service';

@Controller('recommand')
export class RecommandController {
  constructor(private recommandService: RecommandService) {}

  @Get()
  findAllMy(@Req() req) {
    return this.recommandService.findAll(req.user.id);
  }

  @Post()
  async create(
    @Body(ValidationPipe) createRecommandDto: CreateRecommandDto,
    @Req() req,
  ) {
    if (req.user.id !== createRecommandDto.operator) {
      throw new BadRequestException('잘못된 요청입니다.');
    }
    if (req.user.id === createRecommandDto.operands) {
      throw new BadRequestException(
        '자기 자신을 추천인으로 등록할 수 없습니다..',
      );
    }
    return this.recommandService.create(createRecommandDto);
  }
}
