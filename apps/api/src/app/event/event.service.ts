import {Injectable, Logger} from '@nestjs/common';
import {EventEntity, EventRepository} from '@repository/event';
import {Queue} from 'bullmq';
import {InjectQueue} from '@nestjs/bullmq';
import {FeatureId, IBaseEvent, IJwtPayload, IPaginatedResponseDto} from '@abflags/shared';
import {Cron, CronExpression} from "@nestjs/schedule";
import {GetEventRequestDto} from "@app/event/dtos";

@Injectable()
export class EventService {
  private readonly logger = new Logger(EventService.name);
  private unSavedEvents: IBaseEvent[] = [];

  constructor(
    private readonly eventRepository: EventRepository,
    @InjectQueue('event') private eventQueue: Queue<IBaseEvent, string, string>,
  ) {
  }

  async getEventByFeature(u: IJwtPayload, id: FeatureId, payload: GetEventRequestDto): Promise<IPaginatedResponseDto<EventEntity>> {
    const rlt =  await this.eventRepository.getEventByFeatureId(
      u.projectId,
      u.environmentId,
      id,
      payload.page * payload.limit,
      payload.limit,
    )

    return {
      page: payload.page,
      pageSize: payload.limit,
      data: rlt[0],
      total: rlt[1],
    }
  }

  async getEventByProject(u: IJwtPayload, payload: GetEventRequestDto): Promise<IPaginatedResponseDto<EventEntity>>  {
    const rlt = await this.eventRepository.getEventByProjectId(
      u.projectId,
      u.environmentId,
      payload.page * payload.limit,
      payload.limit,
    )

    return {
      page: payload.page,
      pageSize: payload.limit,
      data: rlt[0],
      total: rlt[1],
    }
  }

  async saveEvent(events: IBaseEvent): Promise<void> {
    this.unSavedEvents = [
      ...(this.unSavedEvents ?? []),
      events
    ]
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  batchInsertEvent() {
    const copy = [...this.unSavedEvents]
    this.unSavedEvents = []
    this.eventRepository.save(copy).catch((e) => {
      this.logger.error(e)
    });
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  batchDeleteEvent() {
    return this.eventRepository.clearLog(64);
  }
}
