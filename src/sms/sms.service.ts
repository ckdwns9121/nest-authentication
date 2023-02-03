import { Injectable, HttpStatus, BadRequestException } from '@nestjs/common';
import axios from 'axios';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';

@Injectable()
export class SmsService {
  constructor(
    @InjectRedis()
    private readonly client: Redis,
    private configService: ConfigService,
  ) {}

  private SERVICE_ID = this.configService.get<string>('ncp.service_id');
  private ACCESS_KEY = this.configService.get<string>('ncp.access_key');
  private SECRET_KEY = this.configService.get<string>('ncp.secret_key');
  private REQUEST_URL = `https://sens.apigw.ntruss.com/sms/v2/services/${this.SERVICE_ID}/messages`;
  private POST_URL = `/sms/v2/services/${this.SERVICE_ID}/messages`;

  /**
   * NCP Sign.
   * 네이버 클라우드 플랫폼 서비스를 사용하기 위해 헤더 사이닝
   * @param timestamp
   * @returns
   */
  private makeSignature(timestamp: string): string {
    const message = [];
    const hmac = crypto.createHmac('sha256', this.SECRET_KEY);
    const space = ' ';
    const newLine = '\n';
    const method = 'POST';
    message.push(method);
    message.push(space);
    message.push(this.POST_URL);
    message.push(newLine);
    message.push(timestamp);
    message.push(newLine);
    message.push(this.ACCESS_KEY);
    //message 배열에 위의 내용들을 담아준 후에
    const signature = hmac.update(message.join('')).digest('base64');
    //message.join('') 으로 만들어진 string 을 hmac 에 담고, base64로 인코딩한다
    return signature.toString(); // toString()이 없었어서 에러가 자꾸 났었는데, 반드시 고쳐야함.
  }

  /**
   * 인증번호 전송
   * @param phoneNumber :유저 핸드폰 번호
   * @returns 성공상태
   */
  async sendSMS(phoneNumber: string): Promise<any> {
    const randomNumber = this.generateRandomNumber();
    // 인증번호 레디스에 저장
    await this.client.set(phoneNumber, randomNumber, 'EX', 180);

    const formData = {
      type: 'SMS',
      contentType: 'COMM',
      countryCode: '82',
      from: '01073559121', // 발신자 번호
      content: `[EMotion] 인증번호[${randomNumber}]를 입력해주세요.`,
      messages: [
        {
          to: phoneNumber, // 수신자 번호
        },
      ],
    };
    const timestamp = Date.now().toString();
    const options = {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'x-ncp-iam-access-key': this.ACCESS_KEY,
        'x-ncp-apigw-timestamp': timestamp,
        'x-ncp-apigw-signature-v2': this.makeSignature(timestamp),
      },
    };

    return await axios
      .post(this.REQUEST_URL, formData, options)
      .then((res) => res.data)
      .catch((e) => e.response.data);
  }

  /**
   * 6자리 인증번호 생성
   * @returns randomNumber
   */
  generateRandomNumber(): string {
    const randomNumber = Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, '0');
    return randomNumber;
  }

  /**
   * 인증번호 확인
   */
  async checkAuthNumber(phoneNumber, authNumber: string) {
    const compareAuthNumber = await this.client.get(phoneNumber);
    console.log(compareAuthNumber);
    if (compareAuthNumber === authNumber) {
      await this.client.del(phoneNumber);
      return {
        statusCode: HttpStatus.OK,
        message: 'Authentication completed.',
      };
    } else {
      throw new BadRequestException('Authentication failed.');
    }
  }
}
