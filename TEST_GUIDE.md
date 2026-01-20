# E2E 테스트 가이드

API Gateway를 통한 각 서비스(Coupon, Point, TimeSale)의 E2E 테스트 가이드입니다.

## 📋 목차

- [테스트 개요](#테스트-개요)
- [사전 준비](#사전-준비)
- [테스트 실행](#테스트-실행)
- [테스트 구조](#테스트-구조)
- [각 서비스별 테스트](#각-서비스별-테스트)
- [전략별 테스트](#전략별-테스트)
- [문제 해결](#문제-해결)

## 테스트 개요

본 프로젝트는 API Gateway를 통해 각 마이크로서비스와 통신하는 E2E 테스트를 제공합니다.

### 테스트 범위

1. **Coupon Service** - 쿠폰 발급/사용 (V1, V2, V3 전략)
2. **Point Service** - 적립금 적립/사용
3. **TimeSale Service** - 타임세일 주문 (V1, V2, V3 전략)
4. **API Gateway** - Health check, 라우팅, 검증

### 테스트 파일

```
apps/api-gateway/test/
├── coupon.e2e-spec.ts      # Coupon Service 테스트 (V1/V2/V3)
├── point.e2e-spec.ts        # Point Service 테스트
├── timesale.e2e-spec.ts     # TimeSale Service 테스트 (V1/V2/V3)
└── gateway.e2e-spec.ts      # Gateway 통합 테스트
```

## 사전 준비

### 1. 인프라 실행

모든 인프라(MySQL, Redis, Kafka)가 실행 중이어야 합니다:

```bash
# Docker Compose로 인프라 시작
docker-compose up -d

# 인프라 상태 확인
docker-compose ps
```

필요한 서비스:
- MySQL (3개 인스턴스: ports 3307, 3308, 3309)
- Redis (port 6379)
- Kafka (port 9092)
- Zookeeper (port 2181)

### 2. 데이터베이스 마이그레이션

```bash
# 모든 서비스의 마이그레이션 실행
npm run prisma:migrate:all

# Prisma 클라이언트 생성
npm run prisma:generate:all
```

### 3. 서비스 실행

테스트 전에 모든 서비스가 실행 중이어야 합니다:

```bash
# 모든 서비스 동시 실행
npm run start:all

# 또는 개별 실행
npm run start:gateway              # API Gateway (port 4000)
npm run start:dev coupon-service   # Coupon Service (ports 3001, 5001)
npm run start:dev point-service    # Point Service (ports 3002, 5002)
npm run start:dev timesale-service # TimeSale Service (ports 3003, 5003)
```

서비스 준비 확인:
```bash
# Gateway health check
curl http://localhost:4000/api/health
```

### 4. 의존성 설치

```bash
npm install
```

## 테스트 실행

### 전체 E2E 테스트 실행

```bash
npm run test:e2e
```

### 특정 서비스 테스트 실행

```bash
# Coupon Service만 테스트
npx jest --config ./test/jest-e2e.json apps/api-gateway/test/coupon.e2e-spec.ts

# Point Service만 테스트
npx jest --config ./test/jest-e2e.json apps/api-gateway/test/point.e2e-spec.ts

# TimeSale Service만 테스트
npx jest --config ./test/jest-e2e.json apps/api-gateway/test/timesale.e2e-spec.ts

# Gateway만 테스트
npx jest --config ./test/jest-e2e.json apps/api-gateway/test/gateway.e2e-spec.ts
```

### Watch 모드로 테스트

```bash
npx jest --config ./test/jest-e2e.json --watch
```

### 특정 테스트 케이스만 실행

```bash
# describe 블록 이름으로 필터링
npx jest --config ./test/jest-e2e.json -t "V1 Strategy"

# V2 전략만 테스트
npx jest --config ./test/jest-e2e.json -t "V2 Strategy"

# V3 전략만 테스트
npx jest --config ./test/jest-e2e.json -t "V3 Strategy"
```

### 상세 로그와 함께 실행

```bash
npx jest --config ./test/jest-e2e.json --verbose
```

## 테스트 구조

### Coupon Service 테스트 (coupon.e2e-spec.ts)

**테스트 시나리오:**

1. **쿠폰 정책 생성**
   - 유효한 정책 생성
   - 유효하지 않은 데이터 검증

2. **V1 전략 (Database-based)**
   - 기본 쿠폰 발급
   - 동시성 처리 (~10 requests)
   - 예상 TPS: ~100

3. **V2 전략 (Redis-optimized)**
   - Redis 기반 쿠폰 발급
   - 높은 동시성 처리 (~50 requests)
   - V1 대비 성능 비교
   - 예상 TPS: ~500

4. **V3 전략 (Kafka async)**
   - 비동기 쿠폰 발급
   - 극한 동시성 처리 (~100 requests)
   - 즉시 응답 확인
   - 예상 TPS: ~5,000+

5. **쿠폰 사용 및 조회**
   - 사용자 쿠폰 조회
   - 쿠폰 사용 처리
   - 중복 사용 방지

6. **전략 비교**
   - V1/V2/V3 성능 비교
   - 응답 시간 측정

### Point Service 테스트 (point.e2e-spec.ts)

**테스트 시나리오:**

1. **적립금 적립**
   - 기본 적립
   - 동일 사용자 다중 적립
   - 동시 적립 처리
   - 유효성 검증

2. **잔액 조회**
   - 사용자 잔액 조회
   - 신규 사용자 (잔액 0)
   - 특수문자 userId 처리

3. **적립금 사용**
   - 기본 사용
   - 잔액 부족 시 실패
   - 동시 사용 처리 (비관적 락)
   - 정확한 잔액 차감

4. **내역 조회**
   - 거래 내역 조회
   - 페이지네이션
   - 정렬 검증

5. **통합 시나리오**
   - 전체 사용자 여정
   - 스트레스 테스트
   - 데이터 일관성 검증

### TimeSale Service 테스트 (timesale.e2e-spec.ts)

**테스트 시나리오:**

1. **타임세일 생성**
   - 유효한 타임세일 생성
   - 유효성 검증
   - 날짜 범위 검증

2. **V1 전략 (Database-based)**
   - 기본 주문 생성
   - 동시성 처리 (~20 requests)
   - 재고 초과 방지

3. **V2 전략 (Redis-optimized)**
   - Redis 기반 주문 생성
   - 높은 동시성 처리 (~100 requests)
   - V1 대비 성능 비교
   - 과매 방지 검증

4. **V3 전략 (Kafka async)**
   - 비동기 주문 생성
   - 극한 동시성 처리 (~200 requests)
   - 폭발적 트래픽 처리 (~500 requests)
   - 즉시 응답 확인

5. **재고 관리**
   - 판매 수량 추적
   - 재고 소진 처리
   - 정확한 재고 차감

6. **전략 비교**
   - V1/V2/V3 성능 비교
   - TPS 측정

### Gateway 테스트 (gateway.e2e-spec.ts)

**테스트 시나리오:**

1. **Health Check**
   - 게이트웨이 상태 확인
   - 서비스 가용성 정보

2. **CORS 설정**
   - CORS 활성화 확인

3. **전역 설정**
   - /api 프리픽스 강제
   - ValidationPipe 동작
   - 쿼리 파라미터 변환

4. **Rate Limiting**
   - 다중 요청 처리

5. **서비스 통합**
   - 3개 서비스 라우팅
   - 동시 다중 서비스 호출

6. **에러 처리**
   - 404 처리
   - 서비스 에러 전파
   - 잘못된 요청 처리

7. **전략 파라미터 처리**
   - v1/v2/v3 전략 지원
   - 기본값 처리

8. **성능 모니터링**
   - 지속적인 부하 처리
   - 성공률 측정

9. **gRPC 통합**
   - gRPC 통신 검증

## 전략별 테스트

### V1 Strategy (Database-based)

**특징:**
- Prisma 트랜잭션 사용
- 기본적인 동시성 제어
- ~100 TPS

**테스트 포인트:**
```bash
# Coupon V1 테스트
npx jest --config ./test/jest-e2e.json -t "V1 Strategy"
```

**확인 사항:**
- 트랜잭션 무결성
- 기본적인 동시성 처리
- 정확한 재고/수량 관리

### V2 Strategy (Redis-optimized)

**특징:**
- Redis 분산 락 사용
- 캐시 활용
- 원자적 연산 (INCR/DECR)
- ~500 TPS

**테스트 포인트:**
```bash
# V2 전략 테스트
npx jest --config ./test/jest-e2e.json -t "V2 Strategy"
```

**확인 사항:**
- Redis 락 동작
- V1 대비 성능 향상
- 과매 방지
- 높은 동시성 처리

### V3 Strategy (Kafka async)

**특징:**
- 즉시 응답 (PENDING/QUEUED)
- Kafka Producer/Consumer
- 순차적 처리
- ~5,000+ TPS

**테스트 포인트:**
```bash
# V3 전략 테스트
npx jest --config ./test/jest-e2e.json -t "V3 Strategy"
```

**확인 사항:**
- 즉시 응답 (<500ms)
- 극한 동시성 처리 (100+ requests)
- Kafka 큐잉
- 비동기 처리 완료

### 전략 비교 테스트

```bash
# 성능 비교 테스트만 실행
npx jest --config ./test/jest-e2e.json -t "Strategy Comparison"
```

**측정 항목:**
- 총 소요 시간
- 요청당 평균 시간
- 동시 처리 능력
- 성공률

## 문제 해결

### 테스트 실패 시 체크리스트

1. **인프라 확인**
   ```bash
   docker-compose ps
   ```
   - MySQL, Redis, Kafka 모두 실행 중인지 확인

2. **서비스 확인**
   ```bash
   curl http://localhost:4000/api/health
   curl http://localhost:3001/api/health  # Coupon
   curl http://localhost:3002/api/health  # Point
   curl http://localhost:3003/api/health  # TimeSale
   ```

3. **데이터베이스 마이그레이션**
   ```bash
   npm run prisma:migrate:all
   npm run prisma:generate:all
   ```

4. **Kafka 토픽 확인**
   ```bash
   docker exec -it kafka kafka-topics --list --bootstrap-server localhost:9092
   ```

5. **Redis 연결 확인**
   ```bash
   docker exec -it redis redis-cli ping
   ```

### 일반적인 문제

**1. "Connection refused" 에러**
- 서비스가 실행 중인지 확인
- 포트가 충돌하지 않는지 확인

**2. "Timeout" 에러**
- `testTimeout` 증가: jest-e2e.json에서 30000ms로 설정됨
- Kafka consumer가 실행 중인지 확인

**3. "재고/수량 불일치" 에러**
- 데이터베이스 초기화 후 재시도
- Redis 캐시 초기화: `docker exec -it redis redis-cli FLUSHALL`

**4. V3 테스트 실패**
- Kafka consumer 로그 확인
- 토픽 생성 확인
- Consumer group 확인

### 테스트 격리

각 테스트는 독립적으로 실행되도록 설계되었지만, 필요시 데이터베이스를 초기화할 수 있습니다:

```bash
# 데이터베이스 초기화 및 재마이그레이션
cd apps/coupon-service && prisma migrate reset --force
cd ../point-service && prisma migrate reset --force
cd ../timesale-service && prisma migrate reset --force
cd ../..

# Redis 초기화
docker exec -it redis redis-cli FLUSHALL
```

## 성능 테스트 결과 예시

테스트 실행 후 콘솔에 다음과 같은 성능 비교 결과가 출력됩니다:

```
Strategy Performance Comparison:
V1 (Database):     2500ms (avg: 125.00ms/req)
V2 (Redis):        800ms (avg: 40.00ms/req)
V3 (Kafka Async):  300ms (avg: 15.00ms/req)

V3 handled 500 requests in 3500ms (142.86 TPS)
```

## 추가 정보

### 환경 변수

테스트는 다음 환경 변수를 사용합니다:

```env
# Gateway
GATEWAY_PORT=4000

# Services
COUPON_GRPC_URL=localhost:5001
POINT_GRPC_URL=localhost:5002
TIMESALE_GRPC_URL=localhost:5003

# Database
DATABASE_URL=...

# Redis
REDIS_URL=redis://localhost:6379

# Kafka
KAFKA_BROKERS=localhost:9092
```

### CI/CD 통합

GitHub Actions 등에서 사용:

```yaml
- name: Run E2E Tests
  run: |
    docker-compose up -d
    npm run prisma:migrate:all
    npm run start:all &
    sleep 10
    npm run test:e2e
```

### 테스트 커버리지

```bash
npx jest --config ./test/jest-e2e.json --coverage
```

---

## 문의

테스트 관련 문제가 있을 경우 이슈를 생성해주세요.
