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
  logo?: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  taxIdentifier?: string;
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  jobTitle?: string;
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  domain?: string;
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  userId?: string;
}
