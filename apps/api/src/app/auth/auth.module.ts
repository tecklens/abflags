import {Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {PassportModule} from '@nestjs/passport';
import {AuthController} from './auth.controller';
import {JwtModule} from '@nestjs/jwt';
import {HttpModule} from '@nestjs/axios';
import {
  ApiKeyStrategy,
  GitHubStrategy,
  GoogleStrategy,
  JwtStrategy,
  LocalStrategy,
} from './strategy';
import {UserModule} from "@app/user/user.module";
import {UserRepository} from "@repository/user";
import * as process from "process";
import {UserService} from "@app/user/user.service";
import {MemberRepository} from "@repository/member";
import {EnvironmentRepository} from "@repository/environment";
import {ProjectRepository} from "@repository/project";
import {TypeOrmModule} from "@nestjs/typeorm";
import {LimitService} from "@app/auth/limit.service";
import {ApiKeyRepository} from "@repository/api-key";
import {EnvironmentService} from "@app/environment/environment.service";
import {EnvironmentModule} from "@app/environment/environment.module";
import { VariableRepository } from '@repository/variable';
import {BullModule} from "@nestjs/bullmq";

const repositories = [
  UserRepository,
  MemberRepository,
  EnvironmentRepository,
  ProjectRepository,
  ApiKeyRepository,
  VariableRepository,
]

@Module({
  imports: [
    UserModule,
    EnvironmentModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {expiresIn: 60 * 30},
    }),
    HttpModule.register({
      timeout: 3000,
      maxRedirects: 3,
    }),
    TypeOrmModule.forFeature(repositories),
    BullModule.registerQueue({
      name: 'event',
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    GitHubStrategy,
    ApiKeyStrategy,
    GoogleStrategy,
    ...repositories,
    LimitService,
    UserService,
  ],
  exports: [
    AuthService,
    JwtStrategy,
    GitHubStrategy,
    ApiKeyStrategy,
    GoogleStrategy,
    LimitService,
  ],
  controllers: [AuthController],
})
export class AuthModule {
}
