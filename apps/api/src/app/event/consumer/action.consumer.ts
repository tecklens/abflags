import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { EventService } from '@app/event/event.service';
import { IBaseEvent } from '@abflags/shared';

@Processor('event')
export class NotificationActionConsumer extends WorkerHost {
  constructor(private readonly eventService: EventService) {
    super();
  }
  process(
    job: Job<IBaseEvent, string, string>,
  ): Promise<void> {
    if (job.name === 'action') {
      return this.eventService.saveEvent(job.data)
    }
    return Promise.resolve(undefined);
  }
}
