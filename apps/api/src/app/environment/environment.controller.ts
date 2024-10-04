import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExcludeController,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {EnvironmentService} from '@app/environment/environment.service';
import {JwtAuthGuard} from '@app/auth/strategy/jwt-auth.guard';
import {CreateEnvironmentRequestDto, EnvironmentResponseDto} from "@app/environment/dtos";
import {ApiResponse, ExternalApiAccessible} from "@abtypes/decorators";
import {UserSession} from "@abtypes/user.session";
import {IApiKey, IJwtPayload} from "@abflags/shared";

@ApiBearerAuth()
@Controller('environment')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Environment')
@ApiExcludeController()
export class EnvironmentController {
  constructor(private readonly environmentService: EnvironmentService) {
  }

  @Get('/me')
  @ApiOperation({
    summary: 'Get current environment',
  })
  @ApiResponse(EnvironmentResponseDto)
  @ExternalApiAccessible()
  async getCurrentEnvironment(
    @UserSession() user: IJwtPayload,
  ): Promise<EnvironmentResponseDto> {
    return await this.environmentService.getMeEnvironment(user);
  }

  @Post('/')
  @ApiOperation({
    summary: 'Create environment',
  })
  @UseGuards(JwtAuthGuard)
  @ApiExcludeEndpoint()
  @ApiResponse(EnvironmentResponseDto, 201)
  async createEnvironment(
    @UserSession() user: IJwtPayload,
    @Body() body: CreateEnvironmentRequestDto,
  ): Promise<EnvironmentResponseDto> {
    return await this.environmentService.createEnvironment(user, body, null);
  }

  @Get('/')
  @ApiOperation({
    summary: 'Get environments',
  })
  @ApiResponse(EnvironmentResponseDto, 200, true)
  @ExternalApiAccessible()
  async getMyEnvironments(
    @UserSession() user: IJwtPayload,
  ): Promise<EnvironmentResponseDto[]> {
    return await this.environmentService.getListEnvironment({
      projectId: user.projectId,
    });
  }

  @Post('/api-keys/generate')
  @ApiOperation({
    summary: 'Regenerate api keys',
  })
  @ExternalApiAccessible()
  async generateOrganizationApiKeys(
    @UserSession() user: IJwtPayload,
  ): Promise<IApiKey> {
    return await this.environmentService.generateApiKey(user);
  }

  @Get('/api-keys')
  @ApiOperation({
    summary: 'Get api keys',
  })
  @ExternalApiAccessible()
  async getOrganizationApiKeys(
    @UserSession() user: IJwtPayload,
  ): Promise<IApiKey[]> {
    return await this.environmentService.getApiKey(user);
  }
}
