import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { Recommand } from './redommand.entity';

@Injectable()
export class RecommandService {
  constructor(
    @InjectRepository(Recommand)
    private recommandRepository: Repository<Recommand>,
  ) {}
}
