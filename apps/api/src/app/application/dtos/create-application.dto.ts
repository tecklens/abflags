import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";
import {IsDefined, IsOptional, IsString} from "class-validator";

export class CreateApplicationDto {
  @ApiProperty()
  @IsString()
  @IsDefined()
  appName: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description: string;
}
