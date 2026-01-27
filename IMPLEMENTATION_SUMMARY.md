# Jaeger 분산 추적 시스템 구축 완료

2026-01-27에 완료된 Jaeger 분산 추적 시스템 구축 작업 요약

---

## ✅ 완료된 작업

### 1. Docker Compose 설정
- Jaeger all-in-one 컨테이너 추가 (jaegertracing/all-in-one:1.54)
- OTLP gRPC 수신 포트: 4317
- Jaeger UI 포트: 16686
- Health check 설정 완료

### 2. OpenTelemetry 패키지 설치
설치된 패키지:
```json
{
  "@opentelemetry/api": "^1.9.0",
  "@opentelemetry/sdk-node": "^0.53.0",
  "@opentelemetry/auto-instrumentations-node": "^0.50.0",
  "@opentelemetry/exporter-trace-otlp-grpc": "^0.53.0",
  "@opentelemetry/instrumentation-http": "^0.53.0",
  "@opentelemetry/instrumentation-grpc": "^0.53.0",
  "@opentelemetry/instrumentation-express": "^0.42.0",
  "@opentelemetry/instrumentation-ioredis": "^0.43.0",
  "@opentelemetry/instrumentation-pg": "^0.46.0"
}
```

### 3. TracingModule 구현
파일 위치: `libs/common/src/tracing/`

**TracingService 기능:**
- OpenTelemetry SDK 자동 초기화
- HTTP, gRPC, Redis, PostgreSQL 자동 계측
- OTLP/gRPC 프로토콜로 Jaeger에 전송
- 수동 Span 생성 지원 (`withSpan`)
- Span 속성 및 이벤트 추가 지원

### 4. 모든 서비스에 TracingModule 통합
- ✅ API Gateway
- ✅ Coupon Service
- ✅ Point Service
- ✅ TimeSale Service

각 서비스의 `app.module.ts`에 TracingModule 추가됨

### 5. 환경 변수 설정
모든 서비스의 `.env.example`에 추가:
```bash
SERVICE_NAME=<서비스명>
TRACING_ENABLED=true
JAEGER_ENDPOINT=localhost:4317
```

### 6. 문서 작성
- ✅ `REQUEST_FLOW_GUIDE.md`: 요청-가공-적재 흐름 가이드 (시퀀스 다이어그램 포함)
- ✅ `JAEGER_TRACING_GUIDE.md`: Jaeger 사용 가이드 (UI 사용법, 트러블슈팅 포함)

### 7. 빌드 검증
- ✅ 빌드 성공 (webpack compiled successfully)

---

## 🚀 사용 방법

### 1. 인프라 시작
```bash
# Jaeger 포함 전체 인프라 시작
docker-compose up -d

# Jaeger UI 접속
http://localhost:16686
```

### 2. 환경 변수 설정
각 서비스의 `.env` 파일 생성:
```bash
cp apps/api-gateway/.env.example apps/api-gateway/.env
cp apps/coupon-service/.env.example apps/coupon-service/.env
cp apps/point-service/.env.example apps/point-service/.env
cp apps/timesale-service/.env.example apps/timesale-service/.env
```

### 3. 서비스 실행
```bash
# 모든 서비스 동시 실행
pnpm dev:all

# 또는 개별 실행
pnpm dev:gateway
pnpm dev:coupon
pnpm dev:point
pnpm dev:timesale
```

### 4. Trace 확인
1. 브라우저에서 http://localhost:16686 접속
2. Service 선택 (예: api-gateway)
3. "Find Traces" 클릭
4. Trace를 클릭하여 상세 보기

---

## 📊 추적 가능한 항목

### 자동 계측 (Auto-instrumentation)

| 컴포넌트 | 추적 내용 |
|---------|----------|
| HTTP | REST API 요청/응답 (URL, Method, Status, Duration) |
| gRPC | 서비스 간 gRPC 호출 (Method, Status, Duration) |
| Redis | Redis 명령어 (GET, SET, LOCK, Duration) |
| PostgreSQL | DB 쿼리 (Query type, Duration) |
| Express | 라우팅 및 미들웨어 (Route, Handler, Duration) |

### 예시 Trace

**쿠폰 발급 요청** (`POST /api/v1/coupons/issue`):
```
┌─ HTTP POST (250ms) ──────────────────────────┐
│  api-gateway                                  │
│  ┌─ gRPC IssueCoupon (200ms) ───────────────┐│
│  │  coupon-service                          ││
│  │  ├─ redis.LOCK (10ms)                    ││
│  │  ├─ pg.query SELECT (30ms)               ││
│  │  ├─ pg.query INSERT (50ms)               ││
│  │  ├─ pg.query UPDATE (30ms)               ││
│  │  ├─ kafka.emit (5ms)                     ││
│  │  └─ redis.UNLOCK (2ms)                   ││
│  └──────────────────────────────────────────┘│
└───────────────────────────────────────────────┘
```

---

## 🎯 다음 단계 (선택사항)

### 1. 수동 Span 추가
비즈니스 로직에 커스텀 Span 추가:
```typescript
import { TracingService } from '@common/index';

async someBusinessLogic() {
  return await this.tracing.withSpan(
    'custom.operation',
    async (span) => {
      span.setAttributes({ 'user.id': userId });
      // 비즈니스 로직
      span.addEvent('operation.completed');
      return result;
    }
  );
}
```

### 2. Sampling 설정 (프로덕션)
```typescript
// 10% 샘플링으로 성능 오버헤드 감소
import { TraceIdRatioBasedSampler } from '@opentelemetry/sdk-trace-node';

new NodeSDK({
  sampler: new TraceIdRatioBasedSampler(0.1),
  // ...
});
```

### 3. Grafana 통합
- Grafana에 Jaeger 데이터 소스 추가
- 메트릭과 Trace 연결
- 높은 레이턴시 알림 설정

---

## 📈 기대 효과

### 1. 가시성 향상
- 요청의 전체 생명주기 시각화
- 서비스 간 의존성 자동 매핑
- 에러 발생 지점 즉시 파악

### 2. 성능 최적화
- 병목 지점 자동 탐지
- 각 구간별 소요 시간 측정
- 캐시 효과 검증 가능

### 3. 디버깅 효율
- 분산 환경에서 요청 추적
- 타임아웃 원인 분석
- Race Condition 탐지

---

## 📚 관련 문서

- [REQUEST_FLOW_GUIDE.md](./REQUEST_FLOW_GUIDE.md): 요청-가공-적재 흐름 (시퀀스 다이어그램)
- [JAEGER_TRACING_GUIDE.md](./JAEGER_TRACING_GUIDE.md): Jaeger 상세 사용 가이드
- [MONITORING.md](./MONITORING.md): Prometheus + Grafana 모니터링
- [PERFORMANCE_TEST.md](./PERFORMANCE_TEST.md): k6 성능 테스트
- [PROJECT_COMPLETION.md](./PROJECT_COMPLETION.md): 전체 프로젝트 완료 보고서

---

## ✅ 검증 체크리스트

- [x] Docker Compose에 Jaeger 추가
- [x] OpenTelemetry 패키지 설치
- [x] TracingModule 구현
- [x] 모든 서비스에 TracingModule 통합
- [x] 환경 변수 설정
- [x] 빌드 성공
- [x] 문서 작성 완료

---

**작성일**: 2026-01-27
**작성자**: Claude (Sonnet 4.5)
**버전**: 1.0.0
