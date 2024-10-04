import { Injectable } from '@nestjs/common';
import {
  IRateLimiterRedisOptions,
  RateLimiterRedis,
} from 'rate-limiter-flexible';
import Redis from 'ioredis';
import * as process from 'process';

export const MAX_POINT_IN_MONTH = 1000000000;
export const MAX_POINT_IN_SECOND = 5000;

@Injectable()
export class LimitService {
  private readonly limiter: RateLimiterRedis;
  private readonly limiterSecond: RateLimiterRedis;

  constructor() {
    const redisClient = new Redis({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
      enableOfflineQueue: false,
    });
    const opts: IRateLimiterRedisOptions = {
      // Basic options
      storeClient: redisClient,
      points: MAX_POINT_IN_MONTH, // Number of points
      duration: 30 * 24 * 60 * 60, // Per second(s) // * 1 tháng

      // Custom
      blockDuration: 0, // Do not block if consumed more than points
      keyPrefix: `${process.env.NODE_ENV ?? 'prod'}-ab-l`, // must be unique for limiters with different purpose
    };

    this.limiter = new RateLimiterRedis(opts);

    const optsSecond: IRateLimiterRedisOptions = {
      // Basic options
      storeClient: redisClient,
      points: MAX_POINT_IN_SECOND, // Number of points
      duration: 1, // Per second(s) // * 1 tháng

      // Custom
      blockDuration: 0, // Do not block if consumed more than points
      keyPrefix: `${process.env.NODE_ENV ?? 'prod'}-abs-l`, // must be unique for limiters with different purpose
    };

    this.limiterSecond = new RateLimiterRedis(optsSecond);
  }

  getLimiter() {
    return this.limiter;
  }

  getLimiterSecond() {
    return this.limiterSecond;
  }
}
