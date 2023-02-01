import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventType, LicenseByRecommand } from './license-by-recommand.entity';
import { UserService } from './../user/user.service';
import { User } from '../user/user.entity';
import { LicenseKeyService } from '../license-key/license-key.service';
import { BadRequestException } from '@nestjs/common/exceptions';

@Injectable()
export class LicenseByRecommandService {
  constructor(
    @InjectRepository(LicenseByRecommand)
    private licenseByRecommandRepository: Repository<LicenseByRecommand>,

    private userService: UserService,

    private licenseKeyService: LicenseKeyService,
  ) {}

  // 이벤트 완료할 자건이 되는지 검증
  async check(user_id: any, eventType?: EventType) {
    const user: User = await this.userService.findOneByUserId(user_id);
    if (user.operands.length >= 3) {
      // 추천인 이벤트로 라이센스를 발급 받았는지 판단
      const recommandByEvents = await this.licenseByRecommandRepository.find({
        where: {
          user: {
            user_id: user.user_id,
          },
        },
      });
      console.log(recommandByEvents);

      const existEvent = recommandByEvents.find(
        (item) => item.type === 'RECOMMAND',
      );
      console.log(existEvent);

      if (existEvent) {
        throw new ConflictException('이미 해당 이벤트를 참여하였습니다.');
      }

      // // 라이센스 키 생성
      const licenseKey = await this.licenseKeyService.createEventLicense(user);
      const recommandByEvent = await this.licenseByRecommandRepository.create({
        user,
        licenseKey: licenseKey.key,
        type: EventType.RECOMMAND,
      });
      console.log(recommandByEvent);

      return await this.licenseByRecommandRepository.save(recommandByEvent);
    } else {
      throw new BadRequestException('이벤트 조건에 충족하지 못합니다.');
    }
  }
}
