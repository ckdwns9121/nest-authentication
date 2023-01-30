import { Module } from '@nestjs/common';
import { RecommandService } from './recommand.service';
import { RecommandController } from './recommand.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recommand } from './redommand.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Recommand])],
  providers: [RecommandService],
  controllers: [RecommandController],
})
export class RecommandModule {}
