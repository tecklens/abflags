import {Body, Controller, Get, Post, Query, UseGuards} from '@nestjs/common';
import {ApiBearerAuth, ApiOperation, ApiSecurity, ApiTags} from '@nestjs/swagger';
import {MetricService} from '@app/metric/metric.service';
import {ApiKeyAuthGuard, JwtAuthGuard} from '@app/auth/strategy';
import {UserSession} from '@abtypes/user.session';
import {IJwtPayload} from '@abflags/shared';
import {ExternalApiAccessible} from "@abtypes/decorators";
import {AnalysisMetricDto, ClientBucketMetricDto} from "@app/metric/dtos";

@Controller('metric')
@ApiTags('Metric')
export class MetricController {
  constructor(private readonly metricService: MetricService) {}

  @Post('')
  @UseGuards(ApiKeyAuthGuard)
  @ApiSecurity('api_key')
  @ApiOperation({
    summary: 'API receive metric from sdk',
  })
  @ExternalApiAccessible()
  addMetrics(@UserSession() user: IJwtPayload, @Body() payload: ClientBucketMetricDto) {
    return this.metricService.registerBulkMetrics(user, payload)
  }

  @Get('anal')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'API analysis metric of client sdk',
  })
  analysisMetric(
    @UserSession() user: IJwtPayload, @Query() payload: AnalysisMetricDto
  ) {
    return this.metricService.analysisMetrics(user, payload);
  }

  @Get('anal-project')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'API analysis metric of client sdk',
  })
  analysisMetricProject(
    @UserSession() user: IJwtPayload
  ) {
    return this.metricService.analysisMetricsProject(user);
  }

  @Get('anal-project-env')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  analysisMetricProjectEnv(
    @UserSession() user: IJwtPayload
  ) {
    return this.metricService.analysisEnvMetricProject(user);
  }
}
