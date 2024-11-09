import {Module} from '@nestjs/common';
import {FeatureService} from './feature.service';
import {FeatureController} from './feature.controller';
import {FeatureHealthRepository, FeatureRepository, FeatureStrategyRepository} from '@repository/feature';
import {TypeOrmModule} from '@nestjs/typeorm';
import {BullModule} from "@nestjs/bullmq";
import {CustomerInsightsRepository, CustomerRepository} from "@repository/user";
import {ProjectRepository} from "@repository/project";

const repositories = [ProjectRepository, FeatureRepository, FeatureHealthRepository, FeatureStrategyRepository, CustomerRepository, CustomerInsightsRepository];

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
