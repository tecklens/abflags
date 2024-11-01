import {Context, FeatureStatus, FeatureType, Properties} from "@abflags/shared";
import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";
import {IsArray, IsDefined, IsEnum, IsOptional, IsString} from "class-validator";

export class FrontendFeatureRequest implements Context {
  @ApiProperty()
  @IsDefined()
  @IsString()
  appName: string;
  @ApiProperty()
  @IsDefined()
  @IsString()
  currentTime: Date;
  @ApiPropertyOptional()
  @IsOptional()
  properties: Properties;
  @ApiPropertyOptional()
  @IsOptional()
  remoteAddress: string;
  @ApiProperty()
  @IsDefined()
  @IsString()
  sessionId: string;
  @ApiProperty()
  @IsDefined()
  @IsString()
  userId: string;
}
