import {Module} from '@nestjs/common';
import {FeatureService} from './feature.service';
import {FeatureController} from './feature.controller';
import {FeatureHealthRepository, FeatureRepository} from '@repository/feature';
import {TypeOrmModule} from '@nestjs/typeorm';
import {BullModule} from "@nestjs/bullmq";

const repositories = [FeatureRepository, FeatureHealthRepository];

@Module({
  imports: [
    TypeOrmModule.forFeature(repositories),
    BullModule.registerQueue({
      name: 'event',
    })
  ],
  providers: [FeatureService, ...repositories],
  controllers: [FeatureController],
})
export class FeatureModule {
}
