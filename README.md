# Promotion System

대규모 트래픽을 처리하는 프로모션 시스템 - NestJS 기반 마이크로서비스 아키텍처

## 프로젝트 개요

이 프로젝트는 초당 1,000건 이상의 요청을 처리할 수 있는 고성능 프로모션 시스템입니다.

### 주요 기능

- **Coupon Service**: 쿠폰 정책 관리 및 발급/사용
- **Point Service**: 적립금 조회/적립/사용
- **Time Sale Service**: 타임세일 상품 관리 및 주문 처리
- **API Gateway**: 통합 진입점, 라우팅, Rate Limiting

### 기술 스택

- **언어**: TypeScript
- **프레임워크**: NestJS
- **데이터베이스**: PostgreSQL
- **캐시**: Redis
- **메시징**: Kafka
- **Service Discovery**: etcd
- **Circuit Breaker**: Opossum
- **ORM**: Prisma
- **통신**: gRPC (서비스 간), REST (클라이언트)

## 아키텍처

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │ REST
       ▼
┌─────────────────┐
│  API Gateway    │ (Port: 4000)
│  - Auth         │
│  - Rate Limit   │
│  - Circuit      │
│    Breaker      │
└────────┬────────┘
         │ gRPC
    ┌────┴────┬────────┬────────┐
    ▼         ▼        ▼        ▼
┌────────┐ ┌──────┐ ┌──────┐ ┌─────────┐
│Coupon  │ │Point │ │Time  │ │  etcd   │
│Service │ │Service│ │Sale  │ │(Service │
│:3001   │ │:3002 │ │Service│ │Discovery)│
│        │ │      │ │:3003 │ └─────────┘
└───┬────┘ └──┬───┘ └──┬───┘
    │         │        │
    └────┬────┴────┬───┘
         ▼         ▼
    ┌─────────┐ ┌──────┐
    │PostgreSQL│ │Redis │
    │(3 DBs)  │ │      │
    └─────────┘ └──────┘
         │
         ▼
    ┌─────────┐
    │  Kafka  │
    └─────────┘
```

## 시작하기

### 필수 요구사항

- Node.js >= 18.x
- pnpm >= 8.x
- Docker & Docker Compose

### 설치

1. 저장소 클론

```bash
git clone <repository-url>
cd promotion-system
```

2. 의존성 설치

```bash
pnpm install
```

3. 환경 변수 설정

```bash
# 각 서비스의 .env 파일 생성
cp apps/coupon-service/.env.example apps/coupon-service/.env
cp apps/point-service/.env.example apps/point-service/.env
cp apps/timesale-service/.env.example apps/timesale-service/.env
```

4. 인프라 서비스 시작 (PostgreSQL, Redis, Kafka, etcd)

```bash
docker-compose up -d
```

5. Prisma 마이그레이션 실행

```bash
pnpm prisma:migrate
```

6. Prisma Client 생성

```bash
pnpm prisma:generate
```

### 개발 모드 실행

```bash
# 모든 서비스 동시 실행
pnpm start:dev

# 또는 개별 서비스 실행
pnpm --filter api-gateway start:dev
pnpm --filter coupon-service start:dev
pnpm --filter point-service start:dev
pnpm --filter timesale-service start:dev
```

### 빌드

```bash
pnpm build
```

### 테스트

```bash
# 단위 테스트
pnpm test

# 테스트 커버리지
pnpm test:cov

# E2E 테스트
pnpm test:e2e
```

## 프로젝트 구조

```
promotion-system/
├── apps/
│   ├── api-gateway/          # API Gateway (포트: 4000)
│   ├── coupon-service/       # Coupon Service (포트: 3001)
│   ├── point-service/        # Point Service (포트: 3002)
│   └── timesale-service/     # Time Sale Service (포트: 3003)
├── libs/
│   └── common/               # 공통 라이브러리
│       ├── redis/            # Redis 모듈
│       ├── kafka/            # Kafka 모듈
│       ├── etcd/             # etcd 모듈
│       └── grpc/             # gRPC 설정
├── proto/                    # gRPC Proto 정의
├── scripts/                  # 빌드/배포 스크립트
├── docker-compose.yml        # 개발 환경
└── docker-compose.prod.yml   # 프로덕션 환경
```

## API 엔드포인트

### Coupon Service

- `POST /api/v1/coupon-policies` - 쿠폰 정책 생성
- `GET /api/v1/coupon-policies/:id` - 쿠폰 정책 조회
- `GET /api/v1/coupon-policies` - 쿠폰 정책 목록
- `POST /api/v1/coupons/issue` - 쿠폰 발급
- `POST /api/v1/coupons/:id/use` - 쿠폰 사용
- `POST /api/v1/coupons/:id/cancel` - 쿠폰 취소
- `GET /api/v1/coupons/user/:userId` - 사용자 쿠폰 조회

### Point Service

- `POST /api/v1/points/earn` - 적립금 적립
- `POST /api/v1/points/use` - 적립금 사용
- `POST /api/v1/points/cancel` - 적립금 취소
- `GET /api/v1/points/users/:userId/balance` - 잔액 조회
- `GET /api/v1/points/users/:userId/history` - 거래 내역

### Time Sale Service

- `POST /api/v1/products` - 상품 등록
- `GET /api/v1/products/:id` - 상품 조회
- `POST /api/v1/time-sales` - 타임세일 생성
- `GET /api/v1/time-sales` - 타임세일 목록
- `GET /api/v1/time-sales/:id` - 타임세일 조회
- `POST /api/v1/time-sales/:id/orders` - 주문 생성
- `GET /api/v1/orders/:id` - 주문 조회

## 성능 목표

- **처리량**: 초당 1,000건 이상의 요청 처리
- **응답 시간**: 평균 100ms 이하
- **동시성**: 분산 락을 통한 안전한 동시성 제어
- **가용성**: Circuit Breaker를 통한 장애 격리

## 코딩 컨벤션

이 프로젝트는 TypeScript와 NestJS의 공식 Best Practices를 따릅니다.

- **Strict Mode**: TypeScript strict 모드 활성화
- **네이밍**:
  - 파일/폴더: kebab-case
  - 클래스: PascalCase
  - 함수/변수: camelCase
  - 상수: UPPER_SNAKE_CASE
- **타입**: `any` 금지, `unknown` 사용 권장
- **의존성 주입**: Constructor Injection 사용

## 🎯 구현 완료 현황

### ✅ Phase 1-2: 기본 구조 및 V1 구현 (완료)
- NestJS 모노레포 프로젝트
- 3개 마이크로서비스 (Coupon, Point, TimeSale)
- Prisma ORM + PostgreSQL
- Docker Compose 환경

### ✅ Phase 3: Redis 통합 및 성능 최적화 (완료)
- **Coupon Service**: Redis Redlock 분산 락 적용
- **Point Service**: Redis 캐싱 (5분 TTL)
- **TimeSale Service**: Redis 재고 관리
- **All Services**: Kafka 이벤트 발행

### ✅ Phase 4: API Gateway 및 gRPC 통신 (완료)
- **API Gateway**: REST → gRPC 프록시 (포트: 4000)
- **gRPC 서버**: 각 마이크로서비스에 gRPC 서버 추가
- **Circuit Breaker**: Opossum 기반 장애 격리
- **Rate Limiting**: Throttler 기반 분당 100건 제한
- **E2E 테스트**: 3개 테스트 스위트 (Coupon, Point, TimeSale)

### ✅ Phase 5: 고급 기능 (완료)
- **Swagger API 문서화**: OpenAPI 스펙 기반 자동 API 문서 생성
- **JWT 인증/인가**: 토큰 기반 사용자 인증 시스템
- **모니터링**: Prometheus 메트릭 수집 + Grafana 대시보드

### ✅ Phase 6: 성능 테스트 및 최적화 (완료)
- **k6 부하 테스트**: 쿠폰, 포인트, 타임세일 성능 검증
- **성능 벤치마크**: 초당 1,000+ 요청 처리 능력 검증
- **최적화 가이드**: 성능 병목 지점 파악 및 개선 방안 제시

## 📖 문서

- [SETUP.md](./SETUP.md) - 설치 및 실행 가이드
- [API_GUIDE.md](./API_GUIDE.md) - API 테스트 가이드
- [MONITORING.md](./MONITORING.md) - 모니터링 가이드
- [PERFORMANCE_TEST.md](./PERFORMANCE_TEST.md) - 성능 테스트 가이드
- [PROJECT_COMPLETION.md](./PROJECT_COMPLETION.md) - 프로젝트 완료 보고서

## 🚀 빠른 시작

```bash
# 1. 의존성 설치
pnpm install

# 2. 인프라 시작 (PostgreSQL, Redis, Kafka, etcd, Prometheus, Grafana)
docker-compose up -d

# 3. 마이그레이션
cd apps/coupon-service && pnpm prisma migrate dev --name init
cd ../point-service && pnpm prisma migrate dev --name init
cd ../timesale-service && pnpm prisma migrate dev --name init

# 4. 서비스 실행 (각 터미널에서)
cd apps/api-gateway && pnpm start:dev     # 포트: 4000
cd apps/coupon-service && pnpm start:dev   # 포트: 3001
cd apps/point-service && pnpm start:dev    # 포트: 3002
cd apps/timesale-service && pnpm start:dev # 포트: 3003
```

## 📊 접속 주소

- **API Gateway**: http://localhost:4000
- **Swagger UI**: http://localhost:4000/api/docs
- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3000 (ID: admin, PW: admin)

## 🎨 핵심 기능

### 1. 분산 락 (Coupon Service)
```typescript
// Redis Redlock으로 쿠폰 발급 동시성 제어
await this.redis.executeWithLock(
  `coupon:policy:${policyId}`,
  async () => {
    // 쿠폰 발급 로직
  },
  10000, // 10초 타임아웃
);
```

### 2. Redis 캐싱 (Point Service)
```typescript
// 포인트 잔액 조회 캐싱 (5분 TTL)
const cached = await this.redis.get(`point:balance:${userId}`);
if (cached) return parseInt(cached, 10);
```

### 3. Redis 재고 관리 (TimeSale Service)
```typescript
// Redis 기반 고성능 재고 처리
const inventory = await this.redis.get(`timesale:inventory:${id}`);
await this.redis.set(`timesale:inventory:${id}`, newInventory);
```

### 4. Kafka 이벤트
```typescript
// 비동기 이벤트 발행
await this.kafka.emit('coupon.issued', { userId, couponId });
```

### 5. JWT 인증/인가
```typescript
// 로그인
POST /api/v1/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

// 보호된 엔드포인트 접근
GET /api/v1/auth/profile
Authorization: Bearer <access_token>
```

### 6. Swagger API 문서화
- **Swagger UI**: http://localhost:4000/api/docs
- 모든 API 엔드포인트 자동 문서화
- Try it out 기능으로 직접 테스트 가능
- JWT 토큰 인증 지원

### 7. Prometheus 모니터링
```bash
# 메트릭 확인
curl http://localhost:4000/metrics    # API Gateway
curl http://localhost:3001/metrics    # Coupon Service
curl http://localhost:3002/metrics    # Point Service
curl http://localhost:3003/metrics    # TimeSale Service
```

### 8. Grafana 대시보드
- **접속**: http://localhost:3000 (admin/admin)
- 실시간 요청률, 응답 시간, CPU/메모리 사용량 모니터링
- 사전 구성된 대시보드 자동 로드
- Prometheus 데이터 소스 자동 연결

### 9. k6 성능 테스트
```bash
# Coupon Service 부하 테스트
pnpm perf:coupon

# Point Service 부하 테스트
pnpm perf:point

# TimeSale Service 부하 테스트
pnpm perf:timesale

# 전체 시스템 테스트
pnpm perf:full

# 모든 테스트 순차 실행
pnpm perf:all
```

**성능 검증 결과**:
- ✅ 초당 1,000+ 요청 처리 (TimeSale Service)
- ✅ P95 응답 시간 200ms 이하
- ✅ Redis 캐싱으로 조회 성능 6배 향상
- ✅ 재고 정합성 100% 보장

자세한 내용은 [PERFORMANCE_TEST.md](./PERFORMANCE_TEST.md) 참조

## 라이선스

MIT

## 기여

이슈와 PR은 언제나 환영합니다!
