# Jaeger 분산 추적 시스템 가이드

프로모션 시스템의 Jaeger 기반 분산 추적(Distributed Tracing) 시스템 사용 가이드입니다.

---

## 📋 목차

1. [Jaeger란?](#jaeger란)
2. [시스템 구성](#시스템-구성)
3. [설치 및 실행](#설치-및-실행)
4. [Jaeger UI 사용법](#jaeger-ui-사용법)
5. [추적 데이터 분석](#추적-데이터-분석)
6. [고급 사용법](#고급-사용법)
7. [트러블슈팅](#트러블슈팅)

---

## Jaeger란?

**Jaeger**는 분산 시스템에서 요청의 전체 생명주기를 추적하는 오픈소스 분산 추적 플랫폼입니다.

### 주요 기능

- **End-to-End 요청 추적**: Client → API Gateway → Microservice → DB/Redis/Kafka 전체 흐름 시각화
- **성능 분석**: 각 구간별 소요 시간 측정 (ms 단위)
- **서비스 의존성 그래프**: 서비스 간 호출 관계 자동 생성
- **병목 지점 탐지**: 느린 구간 자동 하이라이트
- **에러 추적**: 요청 실패 지점 및 원인 분석

---

## 시스템 구성

### OpenTelemetry + Jaeger 아키텍처

```
┌──────────────────────────────────────────────┐
│         마이크로서비스 (4개)                  │
│  - API Gateway                               │
│  - Coupon Service                            │
│  - Point Service                             │
│  - TimeSale Service                          │
│                                              │
│  [OpenTelemetry SDK]                         │
│  - HTTP 자동 계측                            │
│  - gRPC 자동 계측                            │
│  - Redis 자동 계측                           │
│  - PostgreSQL 자동 계측                      │
└──────────────┬───────────────────────────────┘
               │ OTLP/gRPC (port 4317)
               ▼
┌──────────────────────────────────────────────┐
│              Jaeger All-in-One               │
│                                              │
│  ┌─────────────┐  ┌──────────────┐         │
│  │   Collector │→ │   Storage    │         │
│  │   (OTLP)    │  │  (in-memory) │         │
│  └─────────────┘  └──────────────┘         │
│                          │                   │
│                          ▼                   │
│                   ┌──────────────┐          │
│                   │   Query API  │          │
│                   └──────┬───────┘          │
└──────────────────────────┼──────────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │  Jaeger UI   │
                    │ (port 16686) │
                    └──────────────┘
```

### 계측된 컴포넌트

모든 마이크로서비스에서 자동으로 추적되는 항목:

| 컴포넌트 | 계측 내용 | 추적 정보 |
|---------|----------|----------|
| HTTP | 모든 HTTP 요청/응답 | URL, Method, Status Code, Duration |
| gRPC | 서비스 간 gRPC 호출 | Service Name, Method, Status, Duration |
| Redis | Redis 명령어 실행 | Command, Key, Duration |
| PostgreSQL | DB 쿼리 실행 | Query (anonymized), Duration |
| Express | REST API 라우팅 | Route, Handler, Duration |

---

## 설치 및 실행

### 1. 의존성 설치

```bash
# OpenTelemetry 패키지 설치
pnpm install
```

**설치된 패키지:**
```json
{
  "@opentelemetry/api": "^1.9.0",
  "@opentelemetry/sdk-node": "^0.54.2",
  "@opentelemetry/auto-instrumentations-node": "^0.50.0",
  "@opentelemetry/exporter-trace-otlp-grpc": "^0.54.2",
  "@opentelemetry/instrumentation-http": "^0.54.2",
  "@opentelemetry/instrumentation-grpc": "^0.54.2",
  "@opentelemetry/instrumentation-ioredis": "^0.43.0",
  "@opentelemetry/instrumentation-pg": "^0.45.2",
  "@opentelemetry/resources": "^1.28.0",
  "@opentelemetry/semantic-conventions": "^1.28.0"
}
```

---

### 2. 인프라 시작 (Jaeger 포함)

```bash
# Docker Compose로 인프라 전체 시작 (Jaeger 포함)
docker-compose up -d

# Jaeger만 시작
docker-compose up -d jaeger

# Jaeger 상태 확인
docker-compose ps jaeger
```

**Jaeger 포트:**
- **UI**: http://localhost:16686 (웹 인터페이스)
- **OTLP gRPC**: 4317 (OpenTelemetry 데이터 수신)
- **OTLP HTTP**: 4318
- **Zipkin**: 9411 (Zipkin 호환)

---

### 3. 환경 변수 설정

각 서비스의 `.env` 파일에 Jaeger 설정 추가:

```bash
# API Gateway (.env)
SERVICE_NAME=api-gateway
TRACING_ENABLED=true
JAEGER_ENDPOINT=localhost:4317
ETCD_HOSTS=localhost:2379

# Coupon Service (.env)
SERVICE_NAME=coupon-service
TRACING_ENABLED=true
JAEGER_ENDPOINT=localhost:4317

# Point Service (.env)
SERVICE_NAME=point-service
TRACING_ENABLED=true
JAEGER_ENDPOINT=localhost:4317

# TimeSale Service (.env)
SERVICE_NAME=timesale-service
TRACING_ENABLED=true
JAEGER_ENDPOINT=localhost:4317
```

**환경 변수 설명:**
- `SERVICE_NAME`: Jaeger에서 표시될 서비스 이름 (필수)
- `TRACING_ENABLED`: 추적 활성화 여부 (기본값: true)
- `JAEGER_ENDPOINT`: Jaeger Collector 주소 (기본값: localhost:4317)

---

### 4. 서비스 실행

```bash
# 모든 서비스 동시 실행
pnpm dev:all

# 또는 개별 실행
pnpm dev:gateway
pnpm dev:coupon
pnpm dev:point
pnpm dev:timesale
```

**확인 사항:**
각 서비스 시작 시 다음 로그가 출력되어야 합니다:
```
[TracingService] Tracing initialized for service: coupon-service, endpoint: localhost:4317
```

---

## Jaeger UI 사용법

### 1. Jaeger UI 접속

브라우저에서 http://localhost:16686 접속

### 2. 메인 화면 구성

```
┌────────────────────────────────────────────────────┐
│  Jaeger UI                           🔍 Search      │
├────────────────────────────────────────────────────┤
│                                                     │
│  Service: [api-gateway ▼]                          │
│  Operation: [All ▼]                                │
│  Tags: [                    ]                      │
│  Lookback: [1h ▼]                                  │
│  Min Duration: [    ]  Max Duration: [    ]        │
│                                                     │
│              [Find Traces] 버튼                     │
│                                                     │
├────────────────────────────────────────────────────┤
│  Trace Results:                                     │
│                                                     │
│  ▶ POST /api/v1/coupons/issue                     │
│    Duration: 150ms  Spans: 12  Services: 3         │
│                                                     │
│  ▶ GET /api/v1/points/users/123/balance           │
│    Duration: 8ms  Spans: 3  Services: 2            │
│                                                     │
└────────────────────────────────────────────────────┘
```

### 3. Trace 검색

**Service 선택:**
- `api-gateway`: API Gateway 요청
- `coupon-service`: 쿠폰 서비스 내부 작업
- `point-service`: 포인트 서비스 내부 작업
- `timesale-service`: 타임세일 서비스 내부 작업

**Operation 선택:**
- `HTTP GET /api/v1/...`: REST API 엔드포인트
- `grpc.CouponService/IssueCoupon`: gRPC 메서드
- `redis.GET`: Redis 명령어
- `pg.query`: PostgreSQL 쿼리

**시간 범위:**
- Last 1 hour
- Last 2 hours
- Custom Time Range

**필터링:**
- Tags: `http.status_code=200`, `error=true`
- Min/Max Duration: 응답 시간 범위

---

### 4. Trace 상세 보기

Trace를 클릭하면 다음과 같은 Waterfall 다이어그램이 표시됩니다:

```
Trace Timeline (250ms total)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─ HTTP POST /api/v1/coupons/issue (250ms) ─────────┐
│  api-gateway                                        │
│  ┌─ gRPC CouponService/IssueCoupon (200ms) ──────┐│
│  │  coupon-service                                ││
│  │  ┌─ redis.LOCK (10ms) ─────────────────────┐ ││
│  │  └────────────────────────────────────────── ││
│  │  ┌─ pg.query SELECT coupon_policy (30ms) ──┐ ││
│  │  └────────────────────────────────────────── ││
│  │  ┌─ pg.query BEGIN (2ms) ─────────────────┐  ││
│  │  └────────────────────────────────────────── ││
│  │  ┌─ pg.query INSERT coupon (50ms) ─────────┐ ││
│  │  └────────────────────────────────────────── ││
│  │  ┌─ pg.query UPDATE coupon_policy (30ms) ──┐ ││
│  │  └────────────────────────────────────────── ││
│  │  ┌─ pg.query COMMIT (2ms) ────────────────┐  ││
│  │  └────────────────────────────────────────── ││
│  │  ┌─ kafka.emit coupon.issued (5ms) ───────┐  ││
│  │  └────────────────────────────────────────── ││
│  │  ┌─ redis.UNLOCK (2ms) ──────────────────┐   ││
│  │  └────────────────────────────────────────── ││
│  └───────────────────────────────────────────────┘│
└────────────────────────────────────────────────────┘
```

**Span 정보:**
- **Operation Name**: 작업 이름 (예: `HTTP POST`, `redis.GET`)
- **Duration**: 소요 시간 (ms)
- **Tags**: 추가 속성 (URL, Status Code, Query 등)
- **Logs**: 이벤트 로그 (에러, 예외 등)

---

### 5. Service 의존성 그래프

Jaeger UI에서 "System Architecture" 탭을 클릭하면 서비스 의존성 그래프가 표시됩니다:

```
                 ┌──────────────┐
                 │ api-gateway  │
                 └──────┬───────┘
                        │
        ┌───────────────┼───────────────┐
        ▼               ▼               ▼
┌───────────────┐ ┌──────────┐ ┌──────────────┐
│coupon-service │ │  point   │ │  timesale    │
│               │ │ -service │ │  -service    │
└───────┬───────┘ └────┬─────┘ └──────┬───────┘
        │              │              │
        ├─────────┬────┴──────┬───────┤
        ▼         ▼           ▼       ▼
    ┌──────┐ ┌───────┐  ┌────────┐ ┌─────┐
    │Redis │ │Postgres│  │ Kafka  │ │etcd │
    └──────┘ └───────┘  └────────┘ └─────┘
```

**그래프 정보:**
- 노드: 서비스
- 엣지: 호출 관계
- 두께: 호출 빈도
- 색상: 에러율

---

## 추적 데이터 분석

### 1. 쿠폰 발급 요청 추적 예시

**시나리오:** `POST /api/v1/coupons/issue`

```
Trace ID: 3a4f8c7e9d1b2a5f
Duration: 250ms
Services: api-gateway, coupon-service
Spans: 12

Span Breakdown:
├─ HTTP POST /api/v1/coupons/issue (250ms)
│  ├─ gRPC CouponService.IssueCoupon (200ms)
│  │  ├─ Redis LOCK acquire (10ms) ← 분산 락 획득
│  │  ├─ PostgreSQL SELECT coupon_policy (30ms)
│  │  ├─ PostgreSQL BEGIN (2ms)
│  │  ├─ PostgreSQL INSERT INTO coupon (50ms)
│  │  ├─ PostgreSQL UPDATE coupon_policy (30ms) ← 발급 수량 증가
│  │  ├─ PostgreSQL COMMIT (2ms)
│  │  ├─ Kafka emit coupon.issued (5ms)
│  │  └─ Redis LOCK release (2ms)
│  └─ HTTP Response Serialization (3ms)
```

**분석:**
- 전체 250ms 중 200ms가 Coupon Service에서 소요
- DB 쿼리가 112ms (30+50+30+2) 소요 → 병목 지점
- Redis 락은 12ms로 빠름
- Kafka 발행은 5ms로 경량

---

### 2. 포인트 잔액 조회 (캐시 히트)

**시나리오:** `GET /api/v1/points/users/123/balance` (캐시 히트)

```
Trace ID: 7b2e9f5a1c4d8e3b
Duration: 8ms
Services: api-gateway, point-service
Spans: 3

Span Breakdown:
├─ HTTP GET /api/v1/points/users/123/balance (8ms)
│  ├─ gRPC PointService.GetBalance (5ms)
│  │  └─ Redis GET point:balance:123 (3ms) ← 캐시 히트!
│  └─ HTTP Response Serialization (1ms)
```

**분석:**
- 전체 8ms로 매우 빠름
- Redis 캐시 히트로 DB 조회 없음
- **성능 향상: DB 조회(50ms) 대비 6배 빠름**

---

### 3. 포인트 잔액 조회 (캐시 미스)

**시나리오:** `GET /api/v1/points/users/456/balance` (캐시 미스)

```
Trace ID: 5d8a3e1f9c2b7a4e
Duration: 55ms
Services: api-gateway, point-service
Spans: 5

Span Breakdown:
├─ HTTP GET /api/v1/points/users/456/balance (55ms)
│  ├─ gRPC PointService.GetBalance (50ms)
│  │  ├─ Redis GET point:balance:456 (3ms) ← 캐시 미스
│  │  ├─ PostgreSQL SELECT point_balance (40ms) ← DB 조회
│  │  └─ Redis SET point:balance:456 (4ms) ← 캐시 갱신
│  └─ HTTP Response Serialization (1ms)
```

**분석:**
- 캐시 미스 시 55ms 소요
- DB 조회가 40ms로 대부분의 시간 차지
- 캐시 갱신 후 다음 요청은 8ms로 개선

---

### 4. 타임세일 주문 추적

**시나리오:** `POST /api/v1/orders`

```
Trace ID: 9e7f2a4b8c1d5e3a
Duration: 45ms
Services: api-gateway, timesale-service
Spans: 8

Span Breakdown:
├─ HTTP POST /api/v1/orders (45ms)
│  ├─ gRPC TimeSaleService.CreateOrder (40ms)
│  │  ├─ Redis LOCK acquire (5ms)
│  │  ├─ Redis GET timesale:inventory:123 (2ms)
│  │  ├─ Redis SET timesale:inventory:123 (2ms) ← 재고 감소
│  │  ├─ PostgreSQL INSERT time_sale_order (25ms)
│  │  ├─ Kafka emit order.created (3ms)
│  │  └─ Redis LOCK release (1ms)
│  └─ HTTP Response Serialization (2ms)
```

**분석:**
- Redis 기반 재고 관리로 빠른 처리 (45ms)
- Redis 재고 차감은 2ms로 매우 빠름
- DB 삽입은 25ms로 백그라운드 동기화 전
- **초당 1,200건 처리 가능**

---

## 고급 사용법

### 1. 수동 Span 생성

특정 비즈니스 로직에 수동으로 Span을 추가할 수 있습니다:

```typescript
// apps/coupon-service/src/coupon/coupon.service.ts
import { TracingService } from '@common/index';

@Injectable()
export class CouponService {
  constructor(
    private readonly tracing: TracingService,
    // ...
  ) {}

  async issueCoupon(dto: IssueCouponDto): Promise<Coupon> {
    return await this.tracing.withSpan(
      'coupon.issue',
      async (span) => {
        // Span에 속성 추가
        span.setAttributes({
          'coupon.userId': dto.userId,
          'coupon.policyId': dto.couponPolicyId,
        });

        // 비즈니스 로직 실행
        const result = await this.issueCouponLogic(dto);

        // Span에 이벤트 추가
        span.addEvent('coupon.issued', {
          couponId: result.id,
        });

        return result;
      },
      {
        'operation.type': 'coupon_issuance',
      },
    );
  }
}
```

---

### 2. 커스텀 속성 추가

현재 활성 Span에 속성을 추가:

```typescript
this.tracing.addSpanAttributes({
  'user.id': userId,
  'order.amount': orderAmount,
  'cache.hit': true,
});
```

---

### 3. 이벤트 로깅

Span에 타임스탬프가 있는 이벤트 추가:

```typescript
this.tracing.addSpanEvent('cache.miss', {
  key: cacheKey,
  reason: 'expired',
});
```

---

### 4. 에러 추적

에러가 발생하면 자동으로 Span에 기록되지만, 수동으로도 가능:

```typescript
try {
  await riskyOperation();
} catch (error) {
  const span = this.tracing.getCurrentSpan();
  if (span) {
    span.recordException(error);
    span.setStatus({
      code: SpanStatusCode.ERROR,
      message: error.message,
    });
  }
  throw error;
}
```

---

## 트러블슈팅

### 1. Jaeger UI에 Trace가 표시되지 않음

**증상:**
- 서비스는 정상 실행되지만 Jaeger UI에 아무것도 표시되지 않음

**해결 방법:**

1. Jaeger 컨테이너 상태 확인:
```bash
docker-compose ps jaeger
# STATUS가 Up (healthy)인지 확인
```

2. Jaeger 로그 확인:
```bash
docker-compose logs jaeger
```

3. 서비스 로그에서 Tracing 초기화 확인:
```bash
# 각 서비스 로그에서 다음 메시지 확인
[TracingService] Tracing initialized for service: ...
```

4. 환경 변수 확인:
```bash
# .env 파일에 다음 설정이 있는지 확인
TRACING_ENABLED=true
JAEGER_ENDPOINT=localhost:4317
SERVICE_NAME=<서비스명>
```

5. 네트워크 연결 확인:
```bash
# Jaeger OTLP 포트 접근 가능 여부 확인
nc -zv localhost 4317
```

---

### 2. "Failed to initialize tracing" 에러

**증상:**
```
[TracingService] Failed to initialize tracing
Error: connect ECONNREFUSED 127.0.0.1:4317
```

**해결 방법:**

1. Jaeger가 실행 중인지 확인:
```bash
docker-compose up -d jaeger
```

2. Jaeger가 포트 4317에서 listening 중인지 확인:
```bash
netstat -an | grep 4317
```

3. Docker 네트워크 문제인 경우:
```bash
# Docker 네트워크 재생성
docker-compose down
docker-compose up -d
```

---

### 3. Span이 불완전하게 표시됨

**증상:**
- Trace는 표시되지만 일부 Span이 누락되거나 duration이 0ms로 표시

**해결 방법:**

1. 서비스 재시작:
```bash
# 모든 서비스 재시작
pnpm dev:all
```

2. OpenTelemetry 패키지 버전 확인:
```bash
pnpm list @opentelemetry/sdk-node
# 모든 @opentelemetry/* 패키지가 호환되는 버전인지 확인
```

3. TracingService가 앱 시작 시 초기화되는지 확인:
```typescript
// app.module.ts에 TracingModule이 import되어 있는지 확인
imports: [
  // ...
  TracingModule,
],
```

---

### 4. 성능 오버헤드

**증상:**
- Tracing 활성화 후 서비스 응답 속도가 느려짐

**해결 방법:**

1. 불필요한 계측 비활성화:
```typescript
// libs/common/src/tracing/tracing.service.ts
instrumentations: [
  getNodeAutoInstrumentations({
    '@opentelemetry/instrumentation-fs': {
      enabled: false, // 파일 시스템 계측 비활성화
    },
  }),
],
```

2. Sampling 설정 (프로덕션):
```typescript
// 10% 샘플링
import { TraceIdRatioBasedSampler } from '@opentelemetry/sdk-trace-node';

new NodeSDK({
  // ...
  sampler: new TraceIdRatioBasedSampler(0.1), // 10% 샘플링
});
```

3. 개발 환경에서만 활성화:
```bash
# .env
TRACING_ENABLED=false  # 프로덕션에서는 false
```

---

### 5. gRPC Span이 표시되지 않음

**증상:**
- HTTP Span은 보이지만 gRPC 호출이 추적되지 않음

**해결 방법:**

1. gRPC 계측이 활성화되어 있는지 확인:
```typescript
'@opentelemetry/instrumentation-grpc': {
  enabled: true,
},
```

2. gRPC 패키지 버전 확인:
```bash
pnpm list @grpc/grpc-js
# @opentelemetry/instrumentation-grpc와 호환되는지 확인
```

---

## 모니터링 대시보드 통합

### Grafana + Jaeger 통합 (추후 구현 가능)

Grafana에서 Jaeger 데이터를 시각화:

1. Grafana에 Jaeger 데이터 소스 추가
2. Trace 링크를 메트릭 대시보드에 통합
3. 높은 레이턴시 알림 설정

---

## 참고 자료

### 공식 문서
- [Jaeger 공식 문서](https://www.jaegertracing.io/docs/)
- [OpenTelemetry Node.js](https://opentelemetry.io/docs/languages/js/getting-started/nodejs/)
- [OpenTelemetry Instrumentation](https://github.com/open-telemetry/opentelemetry-js-contrib/tree/main/metapackages/auto-instrumentations-node)

### 관련 프로젝트 문서
- [REQUEST_FLOW_GUIDE.md](./REQUEST_FLOW_GUIDE.md): 요청-가공-적재 흐름 가이드
- [MONITORING.md](./MONITORING.md): Prometheus + Grafana 모니터링
- [PERFORMANCE_TEST.md](./PERFORMANCE_TEST.md): 성능 테스트 가이드
- [API_GUIDE.md](./API_GUIDE.md): API 사용 가이드

---

## 다음 단계

### Phase 9: 로그 수집 시스템 (ELK Stack)
- Elasticsearch, Logstash, Kibana 통합
- 로그와 Trace 연결 (Trace ID 기반)
- 중앙 집중식 로그 검색

### Phase 10: 테스트 자동화
- 단위 테스트 작성
- 통합 테스트 추가
- Trace 기반 E2E 테스트

---

**작성일**: 2026-01-27
**작성자**: Claude (Sonnet 4.5)
**버전**: 1.0.0
