import { IsString } from 'class-validator';

export class CreateRecommandDto {
  @IsString()
  readonly operator: string;

  @IsString()
  readonly operands: string;
}
