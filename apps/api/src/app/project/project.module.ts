import {Module} from '@nestjs/common';
import {ProjectService} from './project.service';
import {ProjectController} from './project.controller';
import {ProjectRepository} from "@repository/project";
import {TypeOrmModule} from "@nestjs/typeorm";
import {MemberRepository} from "@repository/member";
import {EnvironmentRepository} from "@repository/environment";
import {EnvironmentModule} from "@app/environment/environment.module";
import { VariableRepository } from '@repository/variable';
import {ProjectStatsRepository} from "@repository/project-stats";
import {FeatureRepository} from "@repository/feature";
import {EventRepository} from "@repository/event";
import {BullModule} from "@nestjs/bullmq";

const repositories = [
  ProjectRepository,
  MemberRepository,
  EnvironmentRepository,
  VariableRepository,
  ProjectStatsRepository,
  FeatureRepository,
  EventRepository,
]

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'event',
    }),
    EnvironmentModule,
    TypeOrmModule.forFeature(repositories)
  ],
  providers: [ProjectService, ...repositories],
  controllers: [ProjectController],
})
export class ProjectModule {
}
