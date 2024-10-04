import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '@app/auth/auth.service';
import {PassportStrategyEnum} from "@abflags/shared";

@Injectable()
export class LocalStrategy extends PassportStrategy(
  Strategy,
  PassportStrategyEnum.LOCAL,
) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(email: string, password: string) {
    const user = await this.authService.validateUserLocal(email, password);
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
