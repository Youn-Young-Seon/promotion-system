import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import Redlock from 'redlock';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client!: Redis;
  private redlock!: Redlock;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit(): Promise<void> {
    const host = this.configService.get<string>('REDIS_HOST', 'localhost');
    const port = this.configService.get<number>('REDIS_PORT', 6379);
    const password = this.configService.get<string>('REDIS_PASSWORD');

    this.client = new Redis({
      host,
      port,
      password,
      retryStrategy: (times: number) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
    });

    this.redlock = new Redlock([this.client], {
      driftFactor: 0.01,
      retryCount: 10,
      retryDelay: 200,
      retryJitter: 200,
      automaticExtensionThreshold: 500,
    });

    this.client.on('connect', () => {
      this.logger.log('Redis connected successfully');
    });

    this.client.on('error', (error: Error) => {
      this.logger.error('Redis connection error', error.stack);
    });
  }

  async onModuleDestroy(): Promise<void> {
    await this.client.quit();
    this.logger.log('Redis connection closed');
  }

  getClient(): Redis {
    return this.client;
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: string, ttl?: number): Promise<'OK'> {
    if (ttl) {
      return this.client.set(key, value, 'EX', ttl);
    }
    return this.client.set(key, value);
  }

  async del(key: string): Promise<number> {
    return this.client.del(key);
  }

  async incr(key: string): Promise<number> {
    return this.client.incr(key);
  }

  async decr(key: string): Promise<number> {
    return this.client.decr(key);
  }

  async exists(key: string): Promise<number> {
    return this.client.exists(key);
  }

  async acquireLock(resource: string, ttl = 5000): Promise<Redlock.Lock> {
    try {
      const lock = await this.redlock.acquire([`lock:${resource}`], ttl);
      this.logger.debug(`Lock acquired for resource: ${resource}`);
      return lock;
    } catch (error: unknown) {
      this.logger.error(`Failed to acquire lock for resource: ${resource}`, error);
      throw error;
    }
  }

  async releaseLock(lock: Redlock.Lock): Promise<void> {
    try {
      await lock.release();
      this.logger.debug('Lock released successfully');
    } catch (error: unknown) {
      this.logger.error('Failed to release lock', error);
      throw error;
    }
  }

  async executeWithLock<T>(
    resource: string,
    callback: () => Promise<T>,
    ttl = 5000,
  ): Promise<T> {
    const lock = await this.acquireLock(resource, ttl);
    try {
      return await callback();
    } finally {
      await this.releaseLock(lock);
    }
  }
}
