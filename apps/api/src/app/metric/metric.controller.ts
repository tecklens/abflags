import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MetricService } from '@app/metric/metric.service';
import { ApiKeyAuthGuard } from '@app/auth/strategy';
import { UserSession } from '@abtypes/user.session';
import { IJwtPayload } from '@abflags/shared';
import { ClientMetricDto } from '@app/metric/dtos/client-metric.dto';

@Controller('metric')
@ApiTags('Metric')
export class MetricController {
  constructor(private readonly metricService: MetricService) {}

  @Post('')
  @UseGuards(ApiKeyAuthGuard)
  addMetrics(@UserSession() user: IJwtPayload, @Body() payload: ClientMetricDto[]) {
    return this.metricService.registerBulkMetrics(user, payload)
  }
}
