import { Controller, Get } from '@nestjs/common';
import { CircuitBreakerService } from './common/circuit-breaker.service';

@Controller()
export class AppController {
  constructor(private readonly circuitBreaker: CircuitBreakerService) {}

  @Get('health')
  healthCheck() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'api-gateway',
    };
  }

  @Get('circuit-breakers')
  getCircuitBreakers() {
    return {
      timestamp: new Date().toISOString(),
      circuitBreakers: this.circuitBreaker.getAllStats(),
    };
  }
}
