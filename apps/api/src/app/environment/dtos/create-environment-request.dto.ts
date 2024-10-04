import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDefined , IsOptional, IsString } from 'class-validator';

export class CreateEnvironmentRequestDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  parentId?: string;
}
