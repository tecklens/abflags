import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import {EnvironmentModule} from "@app/environment/environment.module";
import {HttpModule} from "@nestjs/axios";
import {LimitService} from "@app/auth/limit.service";
import {UserRepository} from "@repository/user";
import {EnvironmentRepository} from "@repository/environment";
import {JwtStrategy} from "@app/auth/strategy";
import {AuthService} from "@app/auth/auth.service";
import {MemberRepository} from "@repository/member";
import {JwtService} from "@nestjs/jwt";
import {BugReportRepository} from "@repository/bug-report";
import {ProjectRepository} from "@repository/project";
import {ApiKeyRepository} from "@repository/api-key";
import {TypeOrmModule} from "@nestjs/typeorm";
import { VariableRepository } from '@repository/variable';
import {BullModule} from "@nestjs/bullmq";

const repositories = [
  UserRepository,
  EnvironmentRepository,
  ProjectRepository,
  MemberRepository,
  ApiKeyRepository,
  VariableRepository,
]

@Module({
  imports: [
    EnvironmentModule,
    HttpModule.register({
      timeout: 10000,
      maxRedirects: 2,
    }),
    TypeOrmModule.forFeature(repositories),
    BullModule.registerQueue({
      name: 'event',
    }),
  ],
  providers: [
    LimitService,
    UserService,
    JwtStrategy,
    AuthService,
    JwtService,
    ...repositories,
  ],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
