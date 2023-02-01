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

    // 피 추천인이 존재할 시
    if (recommandIds.length !== 0) {
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
    return [];
  }

  async create(
    createRecommandDto: CreateRecommandDto,
    user_id: string,
  ): Promise<any> {
    const { operands } = createRecommandDto;

    const existOperandUser: User = await this.userService.findOneById(operands);
    if (!existOperandUser) {
      throw new NotFoundException('Is not exist operand user');
    }

    // 나중에 쿼리빌더 필요할 때 참고
    // const existRecommand = await this.recommandRepository
    //   .createQueryBuilder('r')
    //   .innerJoinAndSelect('r.operator', 'u')
    //   .where('u.id = :id', { id: operator })
    //   .getOne();

    const operatorUser: User = await this.userService.findOneByUserId(user_id);

    const existRecommand = await this.recommandRepository.findOne({
      where: { operator: { id: operatorUser.id } },
    });

    if (existRecommand) {
      throw new BadRequestException('Is aleady operand');
    }

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
