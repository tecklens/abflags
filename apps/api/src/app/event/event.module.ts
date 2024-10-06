import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { EventRepository } from '@repository/event';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';

const repositories = [EventRepository];

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'event',
    }),
    TypeOrmModule.forFeature(repositories)
  ],
  providers: [EventService, ...repositories],
  controllers: [EventController],
})
export class EventModule {}
