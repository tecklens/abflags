import {Body, Controller, Get, Param, Post, Query, UseGuards, UseInterceptors} from '@nestjs/common';
import {ApiHeader, ApiOperation, ApiSecurity, ApiTags} from "@nestjs/swagger";
import {FeatureService} from "@app/feature/feature.service";
import {UserSession} from "@abtypes/user.session";
import {FeatureId, IJwtPayload} from "@abflags/shared";
import {CreateFeatureRequestDto, FeatureDto, GetFeatureRequestDto} from "@app/feature/dtos";
import {ApiKeyAuthGuard, JwtAuthGuard} from "@app/auth/strategy";
import {ApiResponse, ExternalApiAccessible} from "@abtypes/decorators";
import {CacheInterceptor} from "@nestjs/cache-manager";

@Controller('feature')
@ApiTags('Feature')
export class FeatureController {
  constructor(private readonly featureService: FeatureService) {
  }

  @Get('')
  @UseGuards(JwtAuthGuard)
  getFeature(@UserSession() user: IJwtPayload, @Query() payload: GetFeatureRequestDto) {
    return this.featureService.getByActiveProject(user, payload)
  }

  @Post('')
  @UseGuards(JwtAuthGuard)
  createFeature(@UserSession() user: IJwtPayload, @Body() payload: CreateFeatureRequestDto) {
    return this.featureService.createFeature(user, payload)
  }

  @Get('all')
  @UseGuards(ApiKeyAuthGuard)
  @ApiResponse(FeatureDto, 200)
  @ApiSecurity('api_key')
  @ApiOperation({
    summary: 'API Get all features',
  })
  @ExternalApiAccessible()
  @UseInterceptors(CacheInterceptor)
  getAllFeature(@UserSession() user: IJwtPayload, @Query() payload: GetFeatureRequestDto) {
    return this.featureService.getByApiKey(user, payload)
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getFeatureById(@UserSession() user: IJwtPayload, @Param('id') id: FeatureId) {
    return this.featureService.getFeatureById(user, id)
  }
}
