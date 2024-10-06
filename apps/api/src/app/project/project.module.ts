import {Module} from '@nestjs/common';
import {ProjectService} from './project.service';
import {ProjectController} from './project.controller';
import {ProjectRepository} from "@repository/project";
import {TypeOrmModule} from "@nestjs/typeorm";
import {MemberRepository} from "@repository/member";
import {EnvironmentRepository} from "@repository/environment";
import {EnvironmentModule} from "@app/environment/environment.module";
import { VariableRepository } from '@repository/variable';

const repositories = [ProjectRepository, MemberRepository, EnvironmentRepository, VariableRepository]

@Module({
  imports: [EnvironmentModule, TypeOrmModule.forFeature(repositories)],
  providers: [ProjectService, ...repositories],
  controllers: [ProjectController],
})
export class ProjectModule {
}
