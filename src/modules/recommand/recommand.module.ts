import { Module } from '@nestjs/common';
import { RecommandService } from './recommand.service';
import { RecommandController } from './recommand.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [],
  providers: [RecommandService],
  controllers: [RecommandController],
})
export class RecommandModule {}
