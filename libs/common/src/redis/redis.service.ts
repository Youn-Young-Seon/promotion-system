import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    private client: RedisClientType;

    async onModuleInit() {
        this.client = createClient({
            url: `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`,
        });

        this.client.on('error', (err) => console.error('Redis Client Error', err));
        await this.client.connect();
    }

    async onModuleDestroy() {
        await this.client.quit();
    }

    getClient(): RedisClientType {
        return this.client;
    }

    // 분산 락 획득
    async acquireLock(key: string, ttl: number = 10000): Promise<boolean> {
        const lockKey = `lock:${key}`;
        const lockValue = Date.now().toString();

        const result = await this.client.set(lockKey, lockValue, {
            NX: true,
            PX: ttl,
        });

        return result === 'OK';
    }

    // 분산 락 해제
    async releaseLock(key: string): Promise<void> {
        const lockKey = `lock:${key}`;
        await this.client.del(lockKey);
    }

    // 캐시 설정
    async set(key: string, value: string, ttl?: number): Promise<void> {
        if (ttl) {
            await this.client.setEx(key, ttl, value);
        } else {
            await this.client.set(key, value);
        }
    }

    // 캐시 조회
    async get(key: string): Promise<string | null> {
        return await this.client.get(key);
    }

    // 캐시 삭제
    async del(key: string): Promise<void> {
        await this.client.del(key);
    }

    // 원자적 증가
    async incr(key: string): Promise<number> {
        return await this.client.incr(key);
    }

    // 원자적 감소
    async decr(key: string): Promise<number> {
        return await this.client.decr(key);
    }

    // 원자적 감소 (음수 방지)
    async decrBy(key: string, decrement: number): Promise<number> {
        return await this.client.decrBy(key, decrement);
    }

    // 키 존재 확인
    async exists(key: string): Promise<boolean> {
        const result = await this.client.exists(key);
        return result === 1;
    }

    // TTL 설정
    async expire(key: string, seconds: number): Promise<void> {
        await this.client.expire(key, seconds);
    }
}
