import {FeatureStatus, FeatureType} from "@abflags/shared";
import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";
import {IsArray, IsDefined, IsEnum, IsOptional, IsString} from "class-validator";

export class CreateFeatureRequestDto {
  @ApiProperty()
  @IsString()
  @IsDefined()
  name: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description: string;
  @ApiProperty()
  @IsEnum(FeatureStatus)
  @IsDefined()
  status: FeatureStatus;

  @ApiProperty()
  @IsEnum(FeatureType)
  @IsDefined()
  type: FeatureType;

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  tags: string[];
}
