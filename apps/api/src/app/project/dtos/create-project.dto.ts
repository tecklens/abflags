import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";
import {IsDefined, IsOptional, IsString} from "class-validator";

export class CreateProjectDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  name: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  logo: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  domain: string;
}
