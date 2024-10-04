import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {IsOptional, IsString} from "class-validator";

export class ServicesHashesDto {
  @ApiProperty()
  intercom?: string;
}

export class UserResponseDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  firstName?: string | null;

  @ApiProperty()
  lastName?: string | null;

  @ApiProperty()
  email?: string | null;

  @ApiProperty()
  profilePicture?: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiPropertyOptional()
  showOnBoarding?: boolean;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  jobTitle?: string;
}
