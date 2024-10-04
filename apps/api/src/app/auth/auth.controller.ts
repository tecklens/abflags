import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Header,
  HttpCode,
  Logger,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {AuthService} from '@app/auth/auth.service';
import {ApiBearerAuth, ApiTags} from '@nestjs/swagger';
import {GitHubAuthGuard, GoogleOAuthGuard, JwtAuthGuard} from './strategy';
import {LoginBodyDto, PasswordResetBodyDto, UserRegistrationBodyDto,} from './dtos';
import {ApiException, buildGoogleOauthRedirectUrl, buildOauthRedirectUrl, IJwtPayload} from "@abflags/shared";
import * as process from "process";
import {UserSession} from "@abtypes/user.session";

@ApiBearerAuth()
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('/github/check')
  checkGithubAuth() {
    Logger.verbose('Checking Github Auth');

    if (
      !process.env.GITHUB_OAUTH_CLIENT_ID ||
      !process.env.GITHUB_OAUTH_CLIENT_SECRET
    ) {
      throw new ApiException(
        'GitHub auth is not configured, please provide GITHUB_OAUTH_CLIENT_ID and GITHUB_OAUTH_CLIENT_SECRET as env variables',
      );
    }

    Logger.verbose('Github Auth has all variables.');

    return {
      success: true,
    };
  }

  @Get('/google/check')
  checkGoogleAuth() {
    Logger.verbose('Checking Google Auth');

    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      throw new ApiException(
        'Google auth is not configured, please provide GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET as env variables',
      );
    }

    Logger.verbose('Google Auth has all variables.');

    return {
      success: true,
    };
  }

  @Get('/google')
  @UseGuards(GoogleOAuthGuard)
  async googleAuth(@Req() req: any) {}

  @Get('/github/callback')
  @UseGuards(GitHubAuthGuard)
  async githubCallback(@Req() request: any, @Res() response: any) {
    const url = buildOauthRedirectUrl({
      frontendUrl: process.env.FRONTEND_URL,
      ...request,
    });

    return response.redirect(url);
  }

  @Get('/google/callback')
  @UseGuards(GoogleOAuthGuard)
  async googleCallback(@Req() request: any, @Res() response: any) {
    const url = buildGoogleOauthRedirectUrl({
      frontendUrl: process.env.FRONTEND_URL,
      ...request,
    });

    return response.redirect(url);
  }

  @Get('/refresh')
  @UseGuards(JwtAuthGuard)
  @Header('Cache-Control', 'no-store')
  refreshToken(@Body() user: IJwtPayload) {
    if (!user || !user._id) throw new BadRequestException();

    return this.authService.refreshToken(user._id);
  }

  @Post('/register')
  @Header('Cache-Control', 'no-store')
  async userRegistration(@Body() body: UserRegistrationBodyDto) {
    return await this.authService.userRegistration(body);
  }

  @Post('/reset/request')
  async forgotPasswordRequest(@Body() body: { email: string }) {
    return await this.authService.resetPassword(body);
  }

  @Post('/reset')
  async passwordReset(@Body() body: PasswordResetBodyDto) {
    return await this.authService.passwordReset(body);
  }

  @Post('/login')
  @Header('Cache-Control', 'no-store')
  async userLogin(@Body() body: LoginBodyDto) {
    return await this.authService.login(body);
  }

  @Post('/environments/:environmentId/switch')
  @Header('Cache-Control', 'no-store')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async projectSwitch(
    @UserSession() user: IJwtPayload,
    @Param('environmentId') environmentId: string,
  ): Promise<{ token: string }> {
    const token = await this.authService.switchEnvironment({
      userId: user._id,
      newEnvironmentId: environmentId,
      projectId: user.projectId,
    });

    return {
      token,
    };
  }

  @Get('/limit/remaining')
  @UseGuards(JwtAuthGuard)
  async getRemainingRequest(@UserSession() user: IJwtPayload): Promise<number> {
    return this.authService.getRemainingRequest(user);
  }

  @Post('/organizations/:organizationId/switch')
  @UseGuards(JwtAuthGuard)
  async organizationSwitch(
    @UserSession() user: IJwtPayload,
    @Param('organizationId') organizationId: string,
  ): Promise<string> {
    return await this.authService.projectSwitch(user, organizationId);
  }
}
