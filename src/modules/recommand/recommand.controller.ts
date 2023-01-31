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
  findAllMy() {
    return 'this will return recommand';
  }

  @Post()
  async create(@Body(ValidationPipe) createRecommandDto: CreateRecommandDto) {
    return this.recommandService.create(createRecommandDto);
  }
}
