import { IsString } from 'class-validator';

export class CreateRecommandDto {
  @IsString()
  readonly operands: string;
}
