import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { AuthService } from '@app/auth/auth.service';
import {AuthProviderEnum, PassportStrategyEnum} from "@abflags/shared";

@Injectable()
export class GoogleStrategy extends PassportStrategy(
  Strategy,
  PassportStrategyEnum.GOOGLE,
) {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.API_ROOT_URL + '/v1/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: {
      id: string;
      displayName: string;
      name: {
        familyName: string;
        givenName: string;
      };
      emails: { value: string; verified: boolean }[];
      photos: { value: string }[];
    },
    done: VerifyCallback,
  ): Promise<any> {
    // const user = {
    //   email: emails[0].value,
    //   firstName: name.givenName,
    //   lastName: name.familyName,
    //   picture: photos[0].value,
    //   accessToken,
    //   refreshToken,
    // };
    try {
      const response = await this.authService.authenticateGoogle(
        AuthProviderEnum.GOOGLE,
        accessToken,
        refreshToken,
        profile,
      );

      done(null, {
        email: profile.emails[0].value,
        token: response.token,
        newUser: response.newUser,
      });
    } catch (err) {
      done(err, false);
    }
  }
}
