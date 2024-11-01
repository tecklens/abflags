import {FeatureStatus, FeatureStrategyStatus} from "@abflags/shared";
import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";
import {IsArray, IsDefined, IsEnum, IsOptional, IsString} from "class-validator";
import {ConditionGroupState} from "@abflags/shared";

export class CreateStrategyRequest {
  @ApiProperty()
  @IsString()
  @IsDefined()
  name: string;
  @ApiProperty()
  @IsString()
  @IsDefined()
  stickiness: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  groupId: string;

  @ApiProperty()
  @IsDefined()
  percentage: number;

  @ApiPropertyOptional()
  @IsOptional()
  conditions?: ConditionGroupState[];

  @ApiProperty()
  @IsEnum(FeatureStrategyStatus)
  @IsDefined()
  status: FeatureStrategyStatus;

  @ApiPropertyOptional()
  @IsOptional()
  sortOrder: number;
}
