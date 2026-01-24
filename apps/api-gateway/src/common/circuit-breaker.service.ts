import { Injectable, Logger } from '@nestjs/common';
import * as CircuitBreaker from 'opossum';

@Injectable()
export class CircuitBreakerService {
  private readonly logger = new Logger(CircuitBreakerService.name);
  private breakers: Map<string, CircuitBreaker> = new Map();

  createBreaker<T>(
    name: string,
    action: (...args: any[]) => Promise<T>,
    options?: CircuitBreaker.Options,
  ): CircuitBreaker<any[], T> {
    if (this.breakers.has(name)) {
      return this.breakers.get(name) as CircuitBreaker<any[], T>;
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

    breaker.on('failure', (error) => {
      this.logger.error(`Circuit Breaker [${name}] failure:`, error.message);
    });

    breaker.on('timeout', () => {
      this.logger.warn(`Circuit Breaker [${name}] timeout`);
    });

    breaker.on('reject', () => {
      this.logger.warn(`Circuit Breaker [${name}] rejected (circuit is open)`);
    });

    breaker.on('fallback', (result) => {
      this.logger.log(`Circuit Breaker [${name}] fallback triggered`);
    });

    this.breakers.set(name, breaker);
    return breaker;
  }

  getBreaker(name: string): CircuitBreaker | undefined {
    return this.breakers.get(name);
  }

  async execute<T>(
    name: string,
    action: (...args: any[]) => Promise<T>,
    ...args: any[]
  ): Promise<T> {
    const breaker = this.getBreaker(name) || this.createBreaker(name, action);
    return await breaker.fire(...args);
  }

  getStats(name: string) {
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

  getAllStats() {
    const stats: any[] = [];
    this.breakers.forEach((breaker, name) => {
      stats.push(this.getStats(name));
    });
    return stats;
  }
}
