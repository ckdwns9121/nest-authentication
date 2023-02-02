import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SmsService {
  constructor(private configService: ConfigService) {}

  private SERVICE_ID = this.configService.get<string>('ncp.service_id');
  private ACCESS_KEY = this.configService.get<string>('ncp.access_key');
  private SECRET_KEY = this.configService.get<string>('ncp.secret_key');
  private REQUEST_URL = `https://sens.apigw.ntruss.com/sms/v2/services/${this.SERVICE_ID}/messages`;
  private POST_URL = `/sms/v2/services/${this.SERVICE_ID}/messages`;

  private makeSignature(timestamp: string): string {
    console.log(this.SERVICE_ID);
    console.log(this.ACCESS_KEY);
    console.log(this.SECRET_KEY);
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

  async sendSMS(phoneNumber: string): Promise<any> {
    const formData = {
      type: 'SMS',
      contentType: 'COMM',
      countryCode: '82',
      from: '01073559121', // 발신자 번호
      content: `EMotion 인증 테스트.`,
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
}
