import { Module } from '@nestjs/common';
import { RecommandService } from './recommand.service';
import { RecommandController } from './recommand.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recommand } from './redommand.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Recommand]), AuthModule],
  providers: [RecommandService],
  controllers: [RecommandController],
})
export class RecommandModule {}
