import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Recommand } from './redommand.entity';
import { CreateRecommandDto } from './dto/create-recommand.dto';
import { UserService } from 'src/modules/user/user.service';
import { User } from '../user/user.entity';
import { BadRequestException } from '@nestjs/common/exceptions';

@Injectable()
export class RecommandService {
  constructor(
    @InjectRepository(Recommand)
    private recommandRepository: Repository<Recommand>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    private userService: UserService,
  ) {}

  async findAll(id: string): Promise<any> {
    const user: User = await this.userService.findOneById(id);
    const { operands } = user;
    const recommandIds = operands.map((item) => item.recommand_id);

    const recommanders = await this.userRepository.find({
      where: {
        operator: {
          recommand_id: In([recommandIds]),
        },
      },
    });
    return recommanders.map((item) => {
      return {
        id: item.id,
        create_at: item.created_at,
      };
    });
  }

  async create(createRecommandDto: CreateRecommandDto): Promise<any> {
    const { operator, operands } = createRecommandDto;

    const existOperandUser: User = await this.userService.findOneById(operands);
    if (!existOperandUser) {
      throw new NotFoundException('존재하지 않는 추천인 아이디입니다.');
    }

    // 나중에 쿼리빌더 필요할 때 참고
    // const existRecommand = await this.recommandRepository
    //   .createQueryBuilder('r')
    //   .innerJoinAndSelect('r.operator', 'u')
    //   .where('u.id = :id', { id: operator })
    //   .getOne();

    const existRecommand = await this.recommandRepository.findOne({
      where: { operator: { id: operator } },
    });

    if (existRecommand) {
      throw new BadRequestException('이미 등록한 추천인이 있습니다.');
    }

    const operatorUser: User = await this.userService.findOneById(operator);

    const data = await this.recommandRepository.create({
      operator: operatorUser,
      operands: existOperandUser,
    });

    const res = await this.recommandRepository.save(data);
    delete res.operator;
    delete res.operands;
    return { ...res, message: `you recommanded ${operands} ` };
  }
}
