import {ApiPropertyOptional} from '@nestjs/swagger';
import {IsInt} from 'class-validator';
import {Type} from 'class-transformer';

export class ClientMetricDto {
  @ApiPropertyOptional()
  @Type(() => Number)
  @IsInt()
  yes: number;
  @ApiPropertyOptional()
  @Type(() => Number)
  @IsInt()
  no: number;
}
