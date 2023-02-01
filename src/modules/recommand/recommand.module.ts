import { Module } from '@nestjs/common';
import { RecommandService } from './recommand.service';
import { RecommandController } from './recommand.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recommand } from './redommand.entity';
import { UserModule } from './../user/user.module';
import { User } from '../user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Recommand, User]), UserModule],
  providers: [RecommandService],
  controllers: [RecommandController],
})
export class RecommandModule {}
