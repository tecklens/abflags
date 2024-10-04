import {
  IsDefined,
  MinLength,
  Matches,
  MaxLength,
  IsUUID,
} from 'class-validator';
import {passwordConstraints} from "@abflags/shared";
import {ApiProperty} from "@nestjs/swagger";
export class PasswordResetBodyDto {
  @ApiProperty()
  @IsDefined()
  @MinLength(passwordConstraints.minLength)
  @MaxLength(passwordConstraints.maxLength)
  @Matches(passwordConstraints.pattern, {
    message:
      // eslint-disable-next-line max-len
      'The password must contain minimum 8 and maximum 64 characters, at least one uppercase letter, one lowercase letter, one number and one special character #?!@$%^&*()-',
  })
  password: string;

  @ApiProperty()
  @IsDefined()
  @MinLength(6, { message: 'OTP min length is 6' })
  otp: string;
}
