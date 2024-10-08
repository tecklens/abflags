import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";
import {IsDefined, IsOptional, IsString} from "class-validator";
import {VariableType} from "@abflags/shared";

export class CreateVariableDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  name: string;
  @ApiProperty()
  @IsString()
  @IsDefined()
  type: VariableType;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  defaultValue: string;

  @ApiPropertyOptional()
  @IsOptional()
  required: boolean;
}
