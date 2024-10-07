import {Controller, Get, Param, Query, UseGuards} from '@nestjs/common';
import {ApiTags} from "@nestjs/swagger";
import {JwtAuthGuard} from "@app/auth/strategy";
import {UserSession} from "@abtypes/user.session";
import {FeatureId, IJwtPayload} from "@abflags/shared";
import {GetEventRequestDto} from "@app/event/dtos";
import {EventService} from "@app/event/event.service";

@Controller('event')
@ApiTags('Event')
@UseGuards(JwtAuthGuard)
export class EventController {
  constructor(private readonly eventService: EventService) {
  }

  @Get('feature/:id')
  getEventByFeature(
    @UserSession() user: IJwtPayload,
    @Query() payload: GetEventRequestDto,
    @Param('id') featureId: FeatureId
  ) {
    return this.eventService.getEventByFeature(user, featureId, payload)
  }

  @Get('project')
  getEventByProject(
    @UserSession() user: IJwtPayload,
    @Query() payload: GetEventRequestDto,
  ) {
    return this.eventService.getEventByProject(user, payload)
  }
}
