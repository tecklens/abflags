import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '@app/auth/auth.service';
import {ConfigService} from "@nestjs/config";
import {PassportStrategyEnum} from "@abflags/shared";

@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
  PassportStrategyEnum.JWT,
) {
  constructor(private readonly authService: AuthService, private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    const user = await this.authService.validateUser(payload);
    if (!user) {
      throw new UnauthorizedException();
    }

    return payload;
  }
}
