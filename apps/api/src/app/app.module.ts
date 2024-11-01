import { Module } from '@nestjs/common';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { NestjsFingerprintModule } from 'nestjs-fingerprint';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { UserModule } from './user/user.module';
import { entities } from '@repository/entities';
import { EnvironmentModule } from './environment/environment.module';
import { CacheModule } from '@nestjs/cache-manager';
import { ProjectModule } from './project/project.module';
import { FeatureModule } from './feature/feature.module';
import { EventModule } from './event/event.module';
import { BullModule } from '@nestjs/bullmq';
import { MetricModule } from './metric/metric.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ApplicationModule } from './application/application.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 10 * 1000, // * 30 second
      max: 100,
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get('REDIS_HOST'),
          port: parseInt(config.get('REDIS_PORT') ?? '6379'),
        },
        defaultJobOptions: {
          attempts: 2,
        },
      }),
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get('MYSQL_HOST'),
        port: parseInt(config.get('MYSQL_PORT')),
        username: config.get('MYSQL_USER'),
        password: config.get('MYSQL_PASS'),
        database: config.get('MYSQL_DB'),
        entities: [...entities],
        charset: 'utf8mb4_unicode_ci',
        synchronize: true,
        keepAlive: 3e4,
        connectTimeoutMS: 3e4,
        logging: ['error'],
      }),
      async dataSourceFactory(options) {
        if (!options) {
          throw new Error('Invalid options passed');
        }

        return addTransactionalDataSource(new DataSource(options));
      },
    }),
    NestjsFingerprintModule.forRoot({
      params: ['headers', 'userAgent', 'ipAddress'],
      cookieOptions: {
        name: 'abflags', // optional
        httpOnly: true, // optional
      },
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 1000,
        limit: 2000,
      },
    ]),
    UserModule,
    EnvironmentModule,
    ProjectModule,
    FeatureModule,
    EventModule,
    MetricModule,
    ApplicationModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
