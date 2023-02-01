import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Recommand } from './redommand.entity';
import { CreateRecommandDto } from './dto/create-recommand.dto';
import { UserService } from 'src/modules/user/user.service';
import { User } from '../user/user.entity';
import { ConflictException } from '@nestjs/common/exceptions';

@Injectable()
export class RecommandService {
  constructor(
    @InjectRepository(Recommand)
    private recommandRepository: Repository<Recommand>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    private userService: UserService,
  ) {}

  /**
   * 유저의 피추천인 목록을 반환하는 함수
   */
  async findAll(id: string): Promise<any> {
    const user: User = await this.userService.findOneById(id);
    const { operands } = user;
    const recommandIds = operands.map((item) => item.recommand_id);

    // 피 추천인이 존재할 시 목록 가져오기
    if (recommandIds.length !== 0) {
      const recommanders = await this.userRepository.find({
        where: {
          operator: {
            recommand_id: In([recommandIds]),
          },
        },
      });

      // 유저 정보 삭제 후 아이디, 추천일자만 담기
      return recommanders.map((item) => {
        return {
          id: item.id,
          create_at: item.created_at,
        };
      });
    }

    // 피 추천인이 없다면 빈 목록 응답
    return [];
  }

  /**
   * 추천인 등록하는 함수
   */
  async create(
    createRecommandDto: CreateRecommandDto,
    user_id: string,
  ): Promise<any> {
    const { operands } = createRecommandDto;

    // 등록하려는 추천인이 존재하는지 확인
    const existOperandUser: User = await this.userService.findOneById(operands);

    // 존재하지 않는다면 에러
    if (!existOperandUser) {
      throw new NotFoundException('Is not exist operand user');
    }

    // 나중에 쿼리빌더 필요할 때 참고
    // const existRecommand = await this.recommandRepository
    //   .createQueryBuilder('r')
    //   .innerJoinAndSelect('r.operator', 'u')
    //   .where('u.id = :id', { id: operator })
    //   .getOne();

    // 등록자 유저 정보 불러오기
    const operatorUser: User = await this.userService.findOneByUserId(user_id);

    // 추천인 이벤트를 참여한 적 있는지 확인
    const existRecommand = await this.recommandRepository.findOne({
      where: { operator: { id: operatorUser.id } },
    });

    // 한 번 참여했다면 에러
    if (existRecommand) {
      throw new ConflictException('Is aleady operand');
    }

    // 추천인 이벤트에 데이터 생성
    const recommand = this.recommandRepository.create({
      operator: operatorUser,
      operands: existOperandUser,
    });

    // 추천인 이벤트에 추천인 - 피추천인 관계 등록
    const res = await this.recommandRepository.save(recommand);
    delete res.operator;
    delete res.operands;

    // 유저 정보 삭제 후 성공 여부 응답
    return { ...res, message: `you recommanded ${operands} ` };
  }
}
