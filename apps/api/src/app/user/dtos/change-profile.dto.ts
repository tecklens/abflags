import { IsDefined, IsEmail } from 'class-validator';

export class ChangeProfileDto {
  @IsDefined()
  @IsEmail()
  email: string;
  username: string;
  bio: string | null;
  urls: string[] | null;
}
