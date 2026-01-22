# 성능 테스트 가이드

## 목적
관계형 DB (V1), Redis (V2), Kafka (V3) 각 전략의 성능을 비교하여 대량 트래픽 환경에서의 처리량(TPS)과 응답 시간을 측정합니다.

## 🚀 빠른 시작 (Quick Start)

```bash
# 1. 인프라 시작
docker-compose up -d

# 2. Prisma 클라이언트 생성 및 빌드
npm run prisma:generate:all
npm run build

# 3. 모든 서비스 시작
npm run start:all

# 4. 새 터미널에서 테스트 데이터 생성
curl -X POST http://localhost:4000/api/coupons/policies \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","description":"Test","totalQuantity":100000,"startTime":"2026-01-01T00:00:00.000Z","endTime":"2026-12-31T23:59:59.000Z","discountType":"PERCENTAGE","discountValue":10,"minimumOrderAmount":0,"maximumDiscountAmount":10000}'

# 5. 성능 테스트 실행 (간단한 테스트)
node test/performance-test.js coupon 100 10

# 6. 본격적인 성능 테스트 (1000건)
npm run perf:coupon
```

## 사전 준비

### 1. 인프라 실행
```bash
docker-compose up -d
```

### 2. 환경 설정 확인

`.env` 파일에 다음 설정이 있는지 확인:

```bash
# Database URLs (각 서비스별 독립 데이터베이스)
DATABASE_URL_COUPON="mysql://root:root@localhost:3307/coupon_db"
DATABASE_URL_POINT="mysql://root:root@localhost:3308/point_db"
DATABASE_URL_TIMESALE="mysql://root:root@localhost:3309/timesale_db"

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Kafka
KAFKA_BROKERS=localhost:9092

# Rate Limiting (성능 테스트용 - 제한 완화)
RATE_LIMIT_MAX=100000
RATE_LIMIT_WINDOW=60
```

### 3. 프로젝트 빌드 및 Prisma 설정

**최초 실행 시 또는 Prisma schema 변경 시:**

```bash
# Prisma 클라이언트 생성
npm run prisma:generate:all

# 프로젝트 빌드
npm run build
```

### 4. 서비스 실행
```bash
npm run start:all
```

**서비스가 정상적으로 시작되면 다음 로그가 표시됩니다:**
```
[Nest] LOG [NestApplication] Nest application successfully started
[Bootstrap] Coupon Service is running on: http://localhost:3001
[Bootstrap] Point Service is running on: http://localhost:3002
[Bootstrap] TimeSale Service is running on: http://localhost:3003
[Bootstrap] API Gateway is running on: http://localhost:4000
```

### 5. 테스트 데이터 준비

각 서비스에 테스트용 정책/상품을 생성해야 합니다:

#### Coupon Policy 생성
```bash
curl -X POST http://localhost:4000/api/coupons/policies \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Performance Test Coupon",
    "description": "For performance testing",
    "totalQuantity": 100000,
    "startTime": "2026-01-01T00:00:00.000Z",
    "endTime": "2026-12-31T23:59:59.000Z",
    "discountType": "PERCENTAGE",
    "discountValue": 10,
    "minimumOrderAmount": 0,
    "maximumDiscountAmount": 10000
  }'
```

**성공 응답 예시:**
```json
{
  "id": "4",
  "title": "Performance Test Coupon",
  "totalQuantity": 100000,
  ...
}
```

생성된 ID를 확인하고, `test/performance-test.js` 파일에서 해당 ID로 수정하세요:
```javascript
// test/performance-test.js
coupon: {
    endpoint: '/api/coupons/issue',
    payload: (userId) => ({
        policyId: '4',  // 여기를 생성된 ID로 변경
        userId: `perf-test-user-${userId}`,
    }),
},
```

#### Point User 생성 (자동 생성됨 - 생략 가능)
Point 서비스는 userId가 없으면 자동으로 생성하므로 별도 준비 불필요

#### TimeSale Product 생성
```bash
curl -X POST http://localhost:4000/api/timesales/products \
  -H "Content-Type: application/json" \
  -d '{
    "productName": "Performance Test Product",
    "originalPrice": 10000,
    "discountedPrice": 5000,
    "stockQuantity": 100000,
    "startTime": "2026-01-01T00:00:00.000Z",
    "endTime": "2026-12-31T23:59:59.000Z"
  }'
```

**주의**: TimeSale 엔드포인트가 구현되지 않았다면 해당 테스트는 생략하세요.

## 성능 테스트 실행

### 기본 테스트 (1000건, 동시성 100)

#### Coupon 서비스 테스트
```bash
npm run perf:coupon
```

#### Point 서비스 테스트
```bash
npm run perf:point
```

#### TimeSale 서비스 테스트
```bash
npm run perf:timesale
```

#### 모든 서비스 테스트
```bash
npm run perf:all
```

### 커스텀 테스트

```bash
# 사용법: node test/performance-test.js <service> <총 요청 수> <동시성>
node test/performance-test.js coupon 5000 200
node test/performance-test.js point 10000 500
node test/performance-test.js timesale 3000 150
```

**파라미터 설명**:
- `<service>`: `coupon`, `point`, `timesale` 중 하나
- `<총 요청 수>`: 전송할 총 요청 수 (기본값: 1000)
- `<동시성>`: 동시 실행할 요청 수 (기본값: 100)

## 출력 결과 해석

### 1. 개별 전략 결과

각 전략(V1, V2, V3)마다 다음 정보가 출력됩니다:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[COUPON] V1 Performance Results
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Success: 950
✗ Failed: 50
⏱  Total Duration: 15.23s
⚡ TPS (Transactions/sec): 62.38

Response Time Statistics (ms):
  Average: 241.50ms
  Min: 45ms
  Max: 1250ms
  P50 (Median): 230ms
  P95: 580ms
  P99: 890ms
```

**주요 지표**:
- **TPS (Transactions Per Second)**: 초당 처리 건수 - **높을수록 좋음**
- **Average Response Time**: 평균 응답 시간 - **낮을수록 좋음**
- **P95/P99**: 95%/99% 백분위 응답 시간 - **안정성 지표**
- **Success Rate**: 성공률 - **100%에 가까울수록 좋음**

### 2. 전략 비교 결과

```
============================================================
               [COUPON] STRATEGY COMPARISON
============================================================

Strategy        TPS          Avg Time     P95          Success Rate
------------------------------------------------------------
V1              62.38        241.50ms     580ms        95.0%
V2              485.21       128.30ms     245ms        98.5%
V3              5247.89      35.20ms      78ms         99.8%

Performance Ranking:
  1. V3
  2. V2
  3. V1
```

## 예상 성능 지표

각 전략의 예상 성능 범위:

| 전략 | 기술 | 예상 TPS | 예상 응답 시간 | 사용 사례 |
|------|------|----------|---------------|-----------|
| **V1** | Database (Prisma Transaction) | ~100 TPS | 200-500ms | 낮은 트래픽, 감사 추적 필요 |
| **V2** | Redis (Distributed Lock + Cache) | ~500 TPS | 50-200ms | 중간 트래픽, 즉시 확정 필요 |
| **V3** | Kafka (Async Processing) | **5,000+ TPS** | 10-50ms | **대량 트래픽, 플래시 세일** |

## 성능 튜닝 팁

### V1 (Database) 성능 개선
1. 데이터베이스 인덱스 최적화
2. 커넥션 풀 크기 조정
3. 트랜잭션 격리 수준 조정

### V2 (Redis) 성능 개선
1. Redis 메모리 할당 증가
2. Lock timeout 조정
3. Connection pool 최적화

### V3 (Kafka) 성능 개선
1. Kafka 파티션 수 증가
2. Consumer 그룹 인스턴스 증가
3. Batch size 조정

## 동시성 테스트 시나리오

### 저부하 테스트 (웜업)
```bash
node test/performance-test.js coupon 100 10
```

### 중간 부하 테스트
```bash
node test/performance-test.js coupon 1000 100
```

### 고부하 테스트
```bash
node test/performance-test.js coupon 5000 500
```

### 극한 부하 테스트 (플래시 세일 시뮬레이션)
```bash
node test/performance-test.js coupon 10000 1000
```

## 트러블슈팅

### 1. "Too Many Requests" (429 에러)
**원인**: Rate Limiting이 활성화되어 있음

**해결**:
1. `.env` 파일에서 `RATE_LIMIT_MAX=100000` 설정 확인
2. API Gateway 재시작: `npm run start:gateway`

### 2. "Connection Refused" 에러
**원인**: 서비스가 실행되지 않음

**해결**:
```bash
# 모든 서비스 실행 확인
npm run start:all

# 또는 개별 실행
npm run start:gateway
npm run start:dev coupon-service
npm run start:dev point-service
npm run start:dev timesale-service
```

### 3. "Internal Server Error" (500 에러)
**원인**: Prisma 클라이언트 또는 환경 변수 문제

**해결**:
```bash
# 1. Prisma 클라이언트 재생성
npm run prisma:generate:all

# 2. 빌드 재실행
npm run build

# 3. 모든 서비스 재시작
npm run start:all
```

### 4. "Environment variable not found: DATABASE_URL_COUPON" 에러
**원인**: 환경 변수가 로드되지 않음

**해결**:
```bash
# 1. .env 파일 확인
cat .env | grep DATABASE_URL

# 2. 다음 변수들이 있는지 확인:
# DATABASE_URL_COUPON
# DATABASE_URL_POINT
# DATABASE_URL_TIMESALE

# 3. 없다면 .env.example에서 복사
cp .env.example .env

# 4. 서비스 재시작
npm run start:all
```

### 5. Prisma 관련 에러 (재시작 시)
**원인**: 코드 변경 후 Prisma 클라이언트가 업데이트되지 않음

**해결**:
```bash
# 1. 생성된 Prisma 클라이언트 삭제
rm -rf apps/coupon-service/src/generated
rm -rf apps/point-service/src/generated
rm -rf apps/timesale-service/src/generated

# 2. dist 폴더 삭제
rm -rf dist

# 3. Prisma 클라이언트 재생성
npm run prisma:generate:all

# 4. 프로젝트 빌드
npm run build

# 5. 서비스 재시작
npm run start:all
```

### 6. Kafka Consumer 지연 (V3 느림)
**원인**: Kafka consumer가 메시지를 처리하지 못함

**해결**:
```bash
# Kafka 컨슈머 그룹 확인
docker exec -it kafka kafka-consumer-groups \
  --bootstrap-server localhost:9092 \
  --describe --group coupon-service-group

# 서비스 로그 확인
# Kafka consumer가 정상 동작하는지 확인
```

### 7. Database Lock 에러 (V1 실패율 높음)
**원인**: 동시성 제어 문제

**해결**:
- 동시성을 낮춰서 테스트: `node test/performance-test.js coupon 1000 50`
- V2 또는 V3 사용 권장

### 8. Redis Connection 에러
**원인**: Redis가 실행되지 않음

**해결**:
```bash
# Redis 실행 확인
docker ps | grep redis

# Redis 재시작
docker-compose restart redis
```

## 성능 테스트 모범 사례

1. **테스트 순서**: V1 → V2 → V3 순서로 실행 (점진적 부하 증가)
2. **재시작**: 각 테스트 후 2-3초 대기 (서비스 회복 시간 - 스크립트에 자동 포함됨)
3. **데이터 클린업**: 장시간 테스트 후 데이터베이스 정리 권장
4. **모니터링**:
   - Database: `docker stats mysql-coupon`
   - Redis: `docker exec -it redis redis-cli INFO stats`
   - Kafka: Consumer lag 확인

## 프로젝트 구조 참고

### Prisma 설정
각 서비스는 독립적인 Prisma 클라이언트를 사용합니다:

- **Coupon Service**: `apps/coupon-service/src/generated/client`
- **Point Service**: `apps/point-service/src/generated/client`
- **TimeSale Service**: `apps/timesale-service/src/generated/client`

### 환경 변수 설정
- 루트 `.env` 파일에 모든 환경 변수 저장
- 각 서비스의 `AppModule`이 자동으로 루트 `.env` 로드
- `DATABASE_URL_[SERVICE]` 형식으로 각 서비스별 DB URL 구분

### 재시작이 필요한 경우
다음 파일을 수정한 경우 서비스 재시작 필요:
- `*.prisma` (schema 파일) → Prisma 재생성 + 빌드 + 재시작
- `*.service.ts`, `*.controller.ts` → 자동 재시작 (watch 모드)
- `.env` (환경 변수) → 서비스 재시작
- `proto/*.proto` (gRPC 정의) → 모든 서비스 재시작

## 결과 분석 예시

### 시나리오: 쿠폰 발급 5000건 (동시성 500)

```
V1 (Database):      TPS: 87.5    → 전체 완료: 57초
V2 (Redis):         TPS: 524.3   → 전체 완료: 9.5초
V3 (Kafka):         TPS: 5124.8  → 전체 완료: 1초

결론: V3가 V1 대비 58배 빠름
```

### 권장 사항
- **일반 쿠폰 발급**: V2 (Redis) 사용 - 즉시 확정, 충분한 성능
- **플래시 세일**: V3 (Kafka) 사용 - 대량 트래픽 처리, 비동기 확정
- **감사 추적 필요**: V1 (Database) 사용 - 트랜잭션 보장

## 추가 성능 테스트 도구

### Apache Bench (ab)
```bash
# 1000건, 동시성 100
ab -n 1000 -c 100 -p coupon.json -T application/json \
  http://localhost:4000/api/coupons/issue?strategy=v3
```

### wrk (권장 - 더 높은 성능)
```bash
wrk -t10 -c100 -d30s --latency \
  http://localhost:4000/api/coupons/issue?strategy=v3
```

### k6 (현대적인 도구)
```bash
k6 run test/k6-script.js
```

---

## 문의 및 개선 사항

성능 테스트 결과나 개선 사항이 있으면 이슈로 등록해주세요.
