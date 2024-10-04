import { Module } from '@nestjs/common';
import { EnvironmentController } from '@app/environment/environment.controller';
import { EnvironmentService } from '@app/environment/environment.service';
import {EnvironmentRepository} from "@repository/environment";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ApiKeyRepository} from "@repository/api-key";
import {MemberRepository} from "@repository/member";

const repositories = [EnvironmentRepository, MemberRepository, ApiKeyRepository]

@Module({
  imports: [TypeOrmModule.forFeature(repositories)],
  providers: [EnvironmentService, ...repositories],
  exports: [EnvironmentService],
  controllers: [EnvironmentController],
})
export class EnvironmentModule {}
