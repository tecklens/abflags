import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDefined, IsInt, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class ClientMetricDto {
  @ApiProperty()
  @IsString()
  @IsDefined()
  featureId: string;
  @ApiProperty()
  @IsString()
  @IsDefined()
  appName: string;
  @ApiProperty()
  @IsString()
  @IsDefined()
  createdAt: Date;

  @ApiPropertyOptional()
  @Type(() => Number)
  @IsInt()
  yes: number;
  @ApiPropertyOptional()
  @Type(() => Number)
  @IsInt()
  no: number;
}
