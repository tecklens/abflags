import { IsDefined, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePassDto {
  @IsDefined()
  @IsString()
  @ApiProperty()
  password: string;

  @IsDefined()
  @IsString()
  @ApiProperty()
  changePasswordTransactionId: string;
}
