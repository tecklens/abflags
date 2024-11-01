import {Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UseInterceptors} from '@nestjs/common';
import {ApiHeader, ApiOperation, ApiSecurity, ApiTags} from "@nestjs/swagger";
import {FeatureService} from "@app/feature/feature.service";
import {UserSession} from "@abtypes/user.session";
import {FeatureId, FeatureStrategyId, IFeatureStrategy, IJwtPayload} from "@abflags/shared";
import {
  CreateFeatureRequestDto,
  CreateStrategyRequest,
  FeatureDto,
  FrontendFeatureRequest,
  GetFeatureRequestDto, UpdateStrategyRequest
} from "@app/feature/dtos";
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

  @Get('frontend')
  @UseGuards(ApiKeyAuthGuard)
  @ApiResponse(FeatureDto, 200)
  @ApiSecurity('api_key')
  @ApiOperation({
    summary: 'API Get features for frontend',
  })
  @ExternalApiAccessible()
  @UseInterceptors(CacheInterceptor)
  getFeatureForFrontend(@UserSession() user: IJwtPayload, @Query() payload: FrontendFeatureRequest) {
    return this.featureService.getFrontendFeature(user, payload)
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getFeatureById(@UserSession() user: IJwtPayload, @Param('id') id: FeatureId) {
    return this.featureService.getFeatureById(user, id)
  }

  @Put(':id/archive')
  @UseGuards(JwtAuthGuard)
  archive(@UserSession() user: IJwtPayload, @Param('id') id: FeatureId) {
    return this.featureService.archive(user, id)
  }

  @Put(':id/enable')
  @UseGuards(JwtAuthGuard)
  enable(@UserSession() user: IJwtPayload, @Param('id') id: FeatureId) {
    return this.featureService.enable(user, id)
  }

  @Post(':id/strategy')
  @UseGuards(JwtAuthGuard)
  createStrategy(
    @UserSession() user: IJwtPayload,
    @Param('id') id: FeatureId,
    @Body() payload: CreateStrategyRequest,
  ) {
    return this.featureService.createStrategy(user, id, payload)
  }

  @Put(':id/strategy')
  @UseGuards(JwtAuthGuard)
  updateStrategy(
    @UserSession() user: IJwtPayload,
    @Param('id') id: FeatureId,
    @Body() payload: UpdateStrategyRequest,
  ) {
    return this.featureService.updateStrategy(user, id, payload)
  }

  @Get(':id/strategy')
  @UseGuards(JwtAuthGuard)
  getAllStrategy(
    @UserSession() user: IJwtPayload,
    @Param('id') id: FeatureId,
  ) {
    return this.featureService.getAllStrategy(user, id)
  }

  @Put(':id/strategy/order')
  @UseGuards(JwtAuthGuard)
  updateOrderStrategy(
    @UserSession() user: IJwtPayload,
    @Body() strategies: IFeatureStrategy[],
  ) {
    return this.featureService.updateOrderStrategy(user, strategies)
  }

  @Put(':id/strategy/:strategyId/disable')
  @UseGuards(JwtAuthGuard)
  disableStrategy(
    @UserSession() user: IJwtPayload,
    @Param('id') id: FeatureId,
    @Param('strategyId') strategyId: FeatureStrategyId,
  ) {
    return this.featureService.disableStrategy(user, id, strategyId)
  }

  @Put(':id/strategy/:strategyId/enable')
  @UseGuards(JwtAuthGuard)
  enableStrategy(
    @UserSession() user: IJwtPayload,
    @Param('id') id: FeatureId,
    @Param('strategyId') strategyId: FeatureStrategyId,
  ) {
    return this.featureService.enableStrategy(user, id, strategyId)
  }

  @Delete(':id/strategy/:strategyId')
  @UseGuards(JwtAuthGuard)
  deleteStrategy(
    @UserSession() user: IJwtPayload,
    @Param('id') id: FeatureId,
    @Param('strategyId') strategyId: FeatureStrategyId,
  ) {
    return this.featureService.deleteStrategy(user, id, strategyId)
  }
}
