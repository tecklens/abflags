import {IsDefined, IsEmail, IsString} from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class LoginBodyDto {
  @ApiProperty()
  @IsDefined()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsDefined()
  @IsString()
  password: string;
}
