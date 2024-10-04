import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExcludeController,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@app/auth/strategy';
import {
  ChangePassDto,
  ChangeProfileDto,
  ChangeProfileEmailDto,
  SubmitBugRequestDto,
  UserOnboardingRequestDto,
  UserOnboardingTourRequestDto,
  UserResponseDto,
} from './dtos';
import {UserService} from "@app/user/user.service";
import {ExternalApiAccessible} from "@abtypes/decorators";
import {UserSession} from "@abtypes/user.session";
import {IJwtPayload} from "@abflags/shared";

@ApiBearerAuth()
@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('User')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/me')
  @ApiOperation({
    summary: 'Get User',
  })
  @ExternalApiAccessible()
  async getMyProfile(
    @UserSession() user: IJwtPayload,
  ): Promise<UserResponseDto> {
    Logger.verbose('Getting User');
    Logger.debug('User id: ' + user._id);
    Logger.verbose('Creating GetMyProfileCommand');

    return this.userService.getMyProfile(user._id);
  }

  @Put('/profile/email')
  async updateProfileEmail(
    @UserSession() user: IJwtPayload,
    @Body() body: ChangeProfileEmailDto,
  ): Promise<UserResponseDto> {
    return await this.userService.updateProfileEmail(user, body);
  }

  @Put('/profile')
  async updateProfile(
    @UserSession() user: IJwtPayload,
    @Body() body: ChangeProfileDto,
  ): Promise<UserResponseDto> {
    return await this.userService.updateProfile(user, body);
  }

  @Put('/onboarding')
  @ApiOperation({
    summary: 'Update onboarding',
  })
  @ExternalApiAccessible()
  async updateOnBoarding(
    @UserSession() user: IJwtPayload,
    @Body() body: UserOnboardingRequestDto,
  ): Promise<UserResponseDto> {
    return await this.userService.updateOnBoarding(user, body);
  }

  @Put('/onboarding-tour')
  async updateOnBoardingTour(
    @UserSession() user: IJwtPayload,
    @Body() body: UserOnboardingTourRequestDto,
  ): Promise<UserResponseDto> {
    return await this.userService.updateOnBoardingTour(user, body);
  }

  @Put('/guide/:type')
  async updateGuide(
    @UserSession() user: IJwtPayload,
    @Param('type') type: string,
  ) {
    return this.userService.updateGuide(user, type);
  }

  @Post('/bug/submit')
  async submitBugReport(
    @UserSession() user: IJwtPayload,
    @Body() payload: SubmitBugRequestDto,
  ) {
    // return this.userService.submitBugFromWeb(user, payload);
  }

  @Post('/send-email-change-pass')
  @UseGuards(JwtAuthGuard)
  async sendEmailChangePass(@UserSession() user: IJwtPayload) {
    return await this.userService.sendChangePassword(user);
  }

  @Post('/change-pass')
  @UseGuards(JwtAuthGuard)
  async changePass(
    @UserSession() user: IJwtPayload,
    @Body() payload: ChangePassDto,
  ) {
    return await this.userService.changePass(user, payload);
  }
}
