import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { Resource } from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from '@opentelemetry/semantic-conventions';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { trace, context, SpanStatusCode, Span } from '@opentelemetry/api';

@Injectable()
export class TracingService implements OnModuleInit {
  private readonly logger = new Logger(TracingService.name);
  private sdk: NodeSDK | null = null;
  private serviceName: string;

  constructor(private readonly configService: ConfigService) {
    this.serviceName = this.configService.get<string>('SERVICE_NAME', 'unknown-service');
  }

  async onModuleInit(): Promise<void> {
    const jaegerEndpoint = this.configService.get<string>('JAEGER_ENDPOINT', 'localhost:4317');
    const enabled = this.configService.get<string>('TRACING_ENABLED', 'true') === 'true';

    if (!enabled) {
      this.logger.log('Tracing is disabled');
      return;
    }

    try {
      // OTLP Exporter 설정 (Jaeger gRPC)
      const traceExporter = new OTLPTraceExporter({
        url: `http://${jaegerEndpoint}`,
      });

      // Service Resource 설정
      const resource = Resource.default().merge(
        new Resource({
          [ATTR_SERVICE_NAME]: this.serviceName,
          [ATTR_SERVICE_VERSION]: '1.0.0',
        }),
      );

      // Node SDK 초기화
      this.sdk = new NodeSDK({
        resource,
        traceExporter,
        instrumentations: [
          getNodeAutoInstrumentations({
            '@opentelemetry/instrumentation-fs': {
              enabled: false, // 파일 시스템 계측 비활성화 (노이즈 감소)
            },
            '@opentelemetry/instrumentation-http': {
              enabled: true,
            },
            '@opentelemetry/instrumentation-express': {
              enabled: true,
            },
            '@opentelemetry/instrumentation-grpc': {
              enabled: true,
            },
            '@opentelemetry/instrumentation-ioredis': {
              enabled: true,
            },
            '@opentelemetry/instrumentation-pg': {
              enabled: true,
            },
          }),
        ],
      });

      await this.sdk.start();
      this.logger.log(`Tracing initialized for service: ${this.serviceName}, endpoint: ${jaegerEndpoint}`);

      // Graceful shutdown
      process.on('SIGTERM', async () => {
        try {
          await this.sdk?.shutdown();
          this.logger.log('Tracing SDK shut down successfully');
        } catch (error) {
          this.logger.error('Error shutting down tracing SDK', error);
        }
      });
    } catch (error) {
      this.logger.error('Failed to initialize tracing', error);
    }
  }

  /**
   * 수동으로 span을 생성하고 함수를 실행
   */
  async withSpan<T>(
    spanName: string,
    fn: (span: Span) => Promise<T>,
    attributes?: Record<string, string | number | boolean>,
  ): Promise<T> {
    const tracer = trace.getTracer(this.serviceName);
    const span = tracer.startSpan(spanName);

    if (attributes) {
      span.setAttributes(attributes);
    }

    try {
      return await context.with(trace.setSpan(context.active(), span), async () => {
        return await fn(span);
      });
    } catch (error: unknown) {
      span.recordException(error as Error);
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    } finally {
      span.end();
    }
  }

  /**
   * 현재 활성 span 가져오기
   */
  getCurrentSpan(): Span | undefined {
    return trace.getSpan(context.active());
  }

  /**
   * Span에 속성 추가
   */
  addSpanAttributes(attributes: Record<string, string | number | boolean>): void {
    const span = this.getCurrentSpan();
    if (span) {
      span.setAttributes(attributes);
    }
  }

  /**
   * Span에 이벤트 추가
   */
  addSpanEvent(name: string, attributes?: Record<string, string | number | boolean>): void {
    const span = this.getCurrentSpan();
    if (span) {
      span.addEvent(name, attributes);
    }
  }
}
