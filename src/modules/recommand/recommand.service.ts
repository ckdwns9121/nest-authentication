import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recommand } from './redommand.entity';
import { CreateRecommandDto } from './dto/create-recommand.dto';
import { UserService } from 'src/modules/user/user.service';
import { User } from '../user/user.entity';

@Injectable()
export class RecommandService {
  constructor(
    @InjectRepository(Recommand)
    private recommandRepository: Repository<Recommand>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    private userService: UserService,
  ) {}

  // 추천인 추가하기
  async create(createRecommandDto: CreateRecommandDto): Promise<string> {
    const { operator, operands } = createRecommandDto;

    const existUser = await this.userService.findOneById(operands);
    if (!existUser) {
      throw new NotFoundException('존재하지 않는 추천인 아이디입니다.');
    }

    const existRecommand = await this.recommandRepository
      .createQueryBuilder('recommand')
      .innerJoinAndSelect('recommand.operator', 'user')
      .where('user.id = :id', { id: operator })
      .getOne();

    if (existRecommand) {
      throw new NotFoundException('이미 등록된 추천인이 있습니다.');
    }
    return '성공';
  }
}
