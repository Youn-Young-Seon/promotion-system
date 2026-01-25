# 성능 테스트 가이드

k6를 사용한 프로모션 시스템 성능 테스트

---

## 📋 개요

이 디렉토리에는 k6를 사용한 부하 테스트 시나리오가 포함되어 있습니다.

### 테스트 시나리오

1. **coupon-load-test.js**: 쿠폰 발급 동시성 테스트
2. **point-load-test.js**: 포인트 적립/사용 테스트
3. **timesale-load-test.js**: 타임세일 주문 부하 테스트
4. **full-system-test.js**: 전체 시스템 통합 테스트

---

## 🚀 실행 방법

### 사전 준비

1. 모든 서비스가 실행 중인지 확인:
   ```bash
   # 인프라 시작
   docker-compose up -d

   # 각 터미널에서 서비스 실행
   cd apps/api-gateway && pnpm start:dev
   cd apps/coupon-service && pnpm start:dev
   cd apps/point-service && pnpm start:dev
   cd apps/timesale-service && pnpm start:dev
   ```

2. 데이터베이스 마이그레이션 완료 확인

### 개별 테스트 실행

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

### 수동 실행 (k6 직접 사용)

```bash
# Docker로 실행
docker run --rm -i --network=host grafana/k6 run - <performance-tests/scenarios/coupon-load-test.js

# k6가 로컬에 설치된 경우
k6 run performance-tests/scenarios/coupon-load-test.js
```

---

## 📊 테스트 설정

### 기본 설정 (baseConfig)

- **워밍업**: 30초 동안 10 VUs
- **램프업**: 1분 동안 50 VUs
- **피크**: 2분 동안 100 VUs
- **램프다운**: 1분 동안 50 VUs
- **종료**: 30초 동안 0 VUs

**총 소요 시간**: 약 5분

### 스트레스 설정 (stressConfig)

TimeSale 테스트에 사용:
- **램프업**: 1분 동안 100 VUs
- **중간**: 3분 동안 500 VUs
- **피크**: 2분 동안 1000 VUs
- **종료**: 1분 동안 0 VUs

**총 소요 시간**: 약 7분

### 성능 목표 (Thresholds)

| 메트릭 | 목표 |
|--------|------|
| P95 응답 시간 | < 200ms |
| P99 응답 시간 | < 500ms |
| 에러율 | < 1% |
| 처리량 | > 100 RPS |

---

## 📈 결과 해석

### 주요 메트릭

테스트 실행 후 다음 메트릭을 확인하세요:

1. **http_req_duration**: HTTP 요청 응답 시간
   - p(95): 95번째 백분위수
   - p(99): 99번째 백분위수
   - avg: 평균

2. **http_req_failed**: 실패한 요청 비율
   - 목표: < 1%

3. **http_reqs**: 초당 요청 수 (RPS)
   - 목표: > 100 RPS

4. **checks**: 검증 통과율
   - 목표: > 95%

### 예시 출력

```
checks.........................: 98.50% ✓ 9850      ✗ 150
data_received..................: 4.2 MB 840 kB/s
data_sent......................: 2.1 MB 420 kB/s
http_req_duration..............: avg=85ms   min=10ms med=75ms max=450ms p(95)=180ms p(99)=320ms
http_req_failed................: 0.80%  ✓ 80       ✗ 9920
http_reqs......................: 10000  200/s
```

---

## 🎯 각 테스트 상세

### 1. Coupon Load Test

**목적**: 쿠폰 발급의 동시성 제어 검증

**테스트 시나리오**:
1. 쿠폰 정책 생성 (10,000개)
2. 동시에 여러 사용자가 쿠폰 발급 요청
3. Redis Redlock을 통한 동시성 제어 검증
4. 사용자 쿠폰 조회

**핵심 검증**:
- Redis 분산 락이 정상 작동하는가?
- 동시 요청 시 중복 발급이 발생하지 않는가?
- 응답 시간이 목표치 이내인가?

### 2. Point Load Test

**목적**: 포인트 적립/사용 성능 및 캐싱 효과 검증

**테스트 시나리오**:
1. 포인트 적립
2. 잔액 조회 (Redis 캐싱 효과 측정)
3. 포인트 사용
4. 거래 내역 조회

**핵심 검증**:
- Redis 캐싱이 잔액 조회 성능을 향상시키는가?
- 적립/사용 응답 시간이 목표치 이내인가?
- Optimistic Locking이 정상 작동하는가?

### 3. TimeSale Load Test

**목적**: 타임세일 주문의 대량 트래픽 처리 검증

**테스트 시나리오**:
1. 상품 및 타임세일 생성 (10,000개 재고)
2. 동시에 대량의 주문 요청 (최대 1000 VUs)
3. Redis 재고 관리 검증
4. 재고 소진 시나리오 확인

**핵심 검증**:
- Redis 기반 재고 관리가 높은 동시성을 처리하는가?
- 재고 초과 주문이 발생하지 않는가?
- 초당 1,000건 이상 처리 가능한가?

### 4. Full System Test

**목적**: 전체 시스템의 통합 성능 검증

**테스트 시나리오**:
- 쿠폰, 포인트, 타임세일을 모두 사용하는 실제 사용자 시나리오 시뮬레이션

**핵심 검증**:
- 모든 서비스가 동시에 부하를 받을 때 안정적인가?
- 서비스 간 영향이 없는가?
- Circuit Breaker가 정상 작동하는가?

---

## 🔧 커스터마이징

### 테스트 설정 변경

`config.js` 파일을 수정하여 테스트 설정을 변경할 수 있습니다:

```javascript
export const baseConfig = {
  stages: [
    { duration: '1m', target: 50 },   // 시간과 VUs 조정
    { duration: '3m', target: 200 },
    { duration: '1m', target: 0 },
  ],

  thresholds: {
    'http_req_duration': ['p(95)<300'], // 목표값 조정
    'http_req_failed': ['rate<0.02'],
  },
};
```

### 환경 변수

```bash
# BASE_URL 변경
BASE_URL=http://localhost:4000/api/v1 pnpm perf:coupon

# Docker 사용 시
docker run --rm -i \
  -e BASE_URL=http://localhost:4000/api/v1 \
  --network=host \
  grafana/k6 run - <performance-tests/scenarios/coupon-load-test.js
```

---

## 📝 결과 저장

### HTML 리포트 생성

```bash
docker run --rm -i --network=host \
  grafana/k6 run --out json=results/coupon-test.json \
  - <performance-tests/scenarios/coupon-load-test.js

# k6-reporter로 HTML 생성 (별도 도구 필요)
```

### CSV로 내보내기

```bash
docker run --rm -i --network=host \
  grafana/k6 run --out csv=results/coupon-test.csv \
  - <performance-tests/scenarios/coupon-load-test.js
```

---

## 🐛 트러블슈팅

### "Connection refused" 에러

- 모든 서비스가 실행 중인지 확인
- API Gateway가 4000 포트에서 실행 중인지 확인
- Docker 네트워크 설정 확인 (`--network=host`)

### 테스트 실패율이 높은 경우

1. 데이터베이스 연결 확인
2. Redis 연결 확인
3. 서비스 로그 확인
4. Prometheus 메트릭으로 병목 지점 파악

### 메모리 부족

- VUs 수를 줄이기
- 테스트 시간 단축
- Docker 리소스 할당 증가

---

## 📚 참고 자료

- [k6 공식 문서](https://k6.io/docs/)
- [k6 성능 목표 설정 가이드](https://k6.io/docs/using-k6/thresholds/)
- [k6 메트릭 설명](https://k6.io/docs/using-k6/metrics/)

---

**작성일**: 2026-01-25
**버전**: 1.0.0
