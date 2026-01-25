import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from './auth/decorators/public.decorator';
import { CircuitBreakerService } from './common/circuit-breaker.service';

@ApiTags('System')
@Controller()
export class AppController {
  constructor(private readonly circuitBreaker: CircuitBreakerService) {}

  @Public()
  @Get('health')
  @ApiOperation({ summary: '헬스 체크', description: 'API Gateway의 상태를 확인합니다.' })
  @ApiResponse({ status: 200, description: '서비스가 정상 작동 중입니다.' })
  healthCheck() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'api-gateway',
    };
  }

  @Public()
  @Get('circuit-breakers')
  @ApiOperation({ summary: 'Circuit Breaker 상태 조회', description: '모든 Circuit Breaker의 상태를 조회합니다.' })
  @ApiResponse({ status: 200, description: 'Circuit Breaker 통계 조회 성공' })
  getCircuitBreakers() {
    return {
      timestamp: new Date().toISOString(),
      circuitBreakers: this.circuitBreaker.getAllStats(),
    };
  }
}
