import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { EventEntity } from '@repository/event/event.entity';

@Injectable()
export class EventRepository extends Repository<EventEntity> {
  constructor(private dataSource: DataSource) {
    super(EventEntity, dataSource.createEntityManager());
  }
}
