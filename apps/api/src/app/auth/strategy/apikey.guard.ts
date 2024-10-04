import {ExecutionContext, Injectable, UnauthorizedException,} from '@nestjs/common';
import {AuthGuard, IAuthModuleOptions} from '@nestjs/passport';
import {Reflector} from '@nestjs/core';
import {Observable} from 'rxjs';
import {PassportStrategyEnum} from "@abflags/shared";

const NONE_AUTH_SCHEME = 'None';

@Injectable()
export class ApiKeyAuthGuard extends AuthGuard(
  PassportStrategyEnum.HEADER_API_KEY,
) {
  constructor(private readonly reflector: Reflector) {
    super();
  }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }

  getAuthenticateOptions(context: ExecutionContext): IAuthModuleOptions<any> {
    const request = context.switchToHttp().getRequest();
    const authorizationHeader = request.headers.authorization;

    request.authScheme = authorizationHeader?.split(' ')[0] || NONE_AUTH_SCHEME;

    const apiEnabled = this.reflector.get<boolean>(
      'external_api_accessible',
      context.getHandler(),
    );
    if (!apiEnabled)
      throw new UnauthorizedException('API endpoint not available');

    return {
      session: false,
      defaultStrategy: PassportStrategyEnum.HEADER_API_KEY,
    };
  }
}
