import { Injectable } from '@nestjs/common';
import { EventRepository } from '@repository/event';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { IBaseEvent } from '@abflags/shared';

@Injectable()
export class EventService {
  constructor(
    private readonly eventRepository: EventRepository,
    @InjectQueue('event') private eventQueue: Queue<IBaseEvent, string, string>,
  ) {}

  async storeEvent(event: IBaseEvent): Promise<void> {
    await this.eventQueue.add('action', event);
  }

  async saveEvent(events: IBaseEvent): Promise<void> {
    let enhancedEvents = events;
    for (const enhancer of [this.enhanceEventsWithTags.bind(this)]) {
      enhancedEvents = await enhancer(enhancedEvents);
    }

    await this.eventRepository.save(enhancedEvents);
  }

  private async enhanceEventsWithTags(
    events: IBaseEvent[],
  ): Promise<IBaseEvent[]> {
    const featureNamesSet = new Set<string>();
    for (const event of events) {
      if (event.featureName && !event.tags) {
        featureNamesSet.add(event.featureName);
      }
    }

    return events;
  }
}
