import {Module} from '@nestjs/common';
import {ApplicationService} from './application.service';
import {ApplicationController} from './application.controller';
import {ApplicationRepository} from "@repository/application";
import {TypeOrmModule} from "@nestjs/typeorm";
import {BullModule} from "@nestjs/bullmq";

const repositories = [ApplicationRepository]

@Module({
  imports: [
    TypeOrmModule.forFeature(repositories),
    BullModule.registerQueue({
      name: 'event'
    })
  ],
  providers: [ApplicationService, ...repositories],
  controllers: [ApplicationController],
})
export class ApplicationModule {
}
