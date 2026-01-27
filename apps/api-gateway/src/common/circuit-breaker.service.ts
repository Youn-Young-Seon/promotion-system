import { Injectable, Logger } from '@nestjs/common';
import CircuitBreaker from 'opossum';

export interface BreakerStats {
  name: string;
  state: 'OPEN' | 'HALF-OPEN' | 'CLOSED';
  stats: CircuitBreaker.Stats;
}

@Injectable()
export class CircuitBreakerService {
  private readonly logger = new Logger(CircuitBreakerService.name);
  private breakers: Map<string, CircuitBreaker<unknown[], unknown>> = new Map();

  createBreaker<T>(
    name: string,
    action: (...args: unknown[]) => Promise<T>,
    options?: CircuitBreaker.Options,
  ): CircuitBreaker<unknown[], T> {
    if (this.breakers.has(name)) {
      return this.breakers.get(name) as CircuitBreaker<unknown[], T>;
    }

    const defaultOptions: CircuitBreaker.Options = {
      timeout: 3000, // 3초 타임아웃
      errorThresholdPercentage: 50, // 에러율 50% 도달 시 Circuit Open
      resetTimeout: 30000, // 30초 후 Half-Open 상태로 전환
      rollingCountTimeout: 10000, // 10초 동안의 통계 수집
      rollingCountBuckets: 10, // 10개의 버킷으로 통계 분할
      volumeThreshold: 10, // 최소 10개의 요청이 있어야 Circuit 작동
      ...options,
    };

    const breaker = new CircuitBreaker(action, defaultOptions);

    // 이벤트 리스너 등록
    breaker.on('open', () => {
      this.logger.warn(`Circuit Breaker [${name}] is OPEN`);
    });

    breaker.on('halfOpen', () => {
      this.logger.log(`Circuit Breaker [${name}] is HALF-OPEN`);
    });

    breaker.on('close', () => {
      this.logger.log(`Circuit Breaker [${name}] is CLOSED`);
    });

    breaker.on('success', () => {
      this.logger.debug(`Circuit Breaker [${name}] success`);
    });

    breaker.on('failure', (error: Error) => {
      this.logger.error(`Circuit Breaker [${name}] failure:`, error.message);
    });

    breaker.on('timeout', () => {
      this.logger.warn(`Circuit Breaker [${name}] timeout`);
    });

    breaker.on('reject', () => {
      this.logger.warn(`Circuit Breaker [${name}] rejected (circuit is open)`);
    });

    breaker.on('fallback', () => {
      this.logger.log(`Circuit Breaker [${name}] fallback triggered`);
    });

    this.breakers.set(name, breaker as CircuitBreaker<unknown[], unknown>);
    return breaker;
  }

  getBreaker(name: string): CircuitBreaker<unknown[], unknown> | undefined {
    return this.breakers.get(name);
  }

  async execute<T>(
    name: string,
    action: (...args: unknown[]) => Promise<T>,
    ...args: unknown[]
  ): Promise<T> {
    const breaker = (this.getBreaker(name) || this.createBreaker(name, action)) as CircuitBreaker<unknown[], T>;
    return await breaker.fire(...args);
  }

  getStats(name: string): BreakerStats | null {
    const breaker = this.breakers.get(name);
    if (!breaker) {
      return null;
    }

    return {
      name,
      state: breaker.opened ? 'OPEN' : breaker.halfOpen ? 'HALF-OPEN' : 'CLOSED',
      stats: breaker.stats,
    };
  }

  getAllStats(): BreakerStats[] {
    const stats: BreakerStats[] = [];
    this.breakers.forEach((_breaker, name) => {
      const stat = this.getStats(name);
      if (stat) {
        stats.push(stat);
      }
    });
    return stats;
  }
}
