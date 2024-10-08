import {Body, Controller, Get, Post, UseGuards, UseInterceptors} from '@nestjs/common';
import {ApiBearerAuth, ApiOperation, ApiSecurity, ApiTags} from "@nestjs/swagger";
import {ApiKeyAuthGuard, JwtAuthGuard} from "@app/auth/strategy";
import {UserSession} from "@abtypes/user.session";
import {IJwtPayload} from "@abflags/shared";
import {ApplicationService} from "@app/application/application.service";
import {CreateApplicationDto} from "@app/application/dtos";
import {ExternalApiAccessible} from "@abtypes/decorators";
import {CacheInterceptor} from "@nestjs/cache-manager";

@Controller('application')
@ApiTags('Application')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {
  }
  @Get('all')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ExternalApiAccessible()
  @UseInterceptors(CacheInterceptor)
  getAll(@UserSession() user: IJwtPayload) {
    return this.applicationService.getAll(user)
  }

  @Post()
  @UseGuards(ApiKeyAuthGuard)
  @ApiSecurity('api_key')
  @ApiOperation({
    summary: 'API create application from sdk',
  })
  @ExternalApiAccessible()
  createApplication(@UserSession() user: IJwtPayload, @Body() payload: CreateApplicationDto) {
    return this.applicationService.createApplication(user, payload)
  }
}
