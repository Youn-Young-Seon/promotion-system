# API 테스트 가이드

## 사전 준비

### 1. 인프라 실행
```bash
docker-compose up -d
```

### 2. 환경 변수 설정
```bash
# Coupon Service
copy apps\coupon-service\.env.example apps\coupon-service\.env

# Point Service
copy apps\point-service\.env.example apps\point-service\.env

# Time Sale Service
copy apps\timesale-service\.env.example apps\timesale-service\.env
```

### 3. Prisma 마이그레이션
```bash
# Coupon Service
cd apps\coupon-service
npx prisma migrate dev --name init
npx prisma generate
cd ..\..

# Point Service
cd apps\point-service
npx prisma migrate dev --name init
npx prisma generate
cd ..\..

# Time Sale Service
cd apps\timesale-service
npx prisma migrate dev --name init
npx prisma generate
npx prisma db seed
cd ..\..
```

### 4. 서비스 실행
```bash
# 터미널 1
npm run start:dev coupon-service

# 터미널 2
npm run start:dev point-service

# 터미널 3
npm run start:dev timesale-service
```

---

## Coupon Service API 테스트

### Swagger 문서
http://localhost:3001/api/docs

### 1. 쿠폰 정책 생성
```bash
curl -X POST http://localhost:3001/api/coupons/policies \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"신규가입 쿠폰\",
    \"description\": \"신규 회원 전용 10% 할인\",
    \"totalQuantity\": 100,
    \"startTime\": \"2026-01-11T00:00:00Z\",
    \"endTime\": \"2026-12-31T23:59:59Z\",
    \"discountType\": \"PERCENTAGE\",
    \"discountValue\": 10,
    \"minimumOrderAmount\": 10000,
    \"maximumDiscountAmount\": 5000
  }"
```

### 2. 쿠폰 발급 (V1 - DB 기반)
```bash
curl -X POST "http://localhost:3001/api/coupons/issue?strategy=v1" \
  -H "Content-Type: application/json" \
  -d "{
    \"policyId\": \"1\",
    \"userId\": \"1001\"
  }"
```

### 3. 쿠폰 발급 (V2 - Redis 분산 락)
```bash
curl -X POST "http://localhost:3001/api/coupons/issue?strategy=v2" \
  -H "Content-Type: application/json" \
  -d "{
    \"policyId\": \"1\",
    \"userId\": \"1002\"
  }"
```

### 4. 사용자 쿠폰 조회
```bash
curl http://localhost:3001/api/coupons/user/1001
```

### 5. 쿠폰 사용
```bash
curl -X POST http://localhost:3001/api/coupons/use \
  -H "Content-Type: application/json" \
  -d "{
    \"couponId\": \"1\",
    \"orderId\": \"5001\"
  }"
```

---

## Point Service API 테스트

### Swagger 문서
http://localhost:3002/api/docs

### 1. 적립금 적립
```bash
curl -X POST http://localhost:3002/api/points/add \
  -H "Content-Type: application/json" \
  -d "{
    \"userId\": \"1001\",
    \"amount\": 10000,
    \"description\": \"회원가입 적립\"
  }"
```

### 2. 적립금 잔액 조회 (Redis 캐싱)
```bash
curl http://localhost:3002/api/points/1001
```

### 3. 적립금 내역 조회
```bash
curl "http://localhost:3002/api/points/1001/history?page=1&limit=10"
```

### 4. 적립금 사용
```bash
curl -X POST http://localhost:3002/api/points/use \
  -H "Content-Type: application/json" \
  -d "{
    \"userId\": \"1001\",
    \"amount\": 3000,
    \"description\": \"주문 결제\"
  }"
```

---

## Time Sale Service API 테스트

### Swagger 문서
http://localhost:3003/api/docs

### 1. 타임세일 조회
```bash
curl http://localhost:3003/api/timesales/1
```

### 2. 타임세일 상태 변경 (ACTIVE로)
```sql
-- MySQL에서 직접 실행
UPDATE time_sales SET status = 'ACTIVE' WHERE id = 1;
```

### 3. 타임세일 주문 (V1 - DB 기반)
```bash
curl -X POST "http://localhost:3003/api/timesales/1/orders?strategy=v1" \
  -H "Content-Type: application/json" \
  -d "{
    \"userId\": \"1001\",
    \"quantity\": 1
  }"
```

### 4. 타임세일 주문 (V2 - Redis 재고 관리)
```bash
curl -X POST "http://localhost:3003/api/timesales/1/orders?strategy=v2" \
  -H "Content-Type: application/json" \
  -d "{
    \"userId\": \"1002\",
    \"quantity\": 1
  }"
```

---

## 동시성 테스트

### 쿠폰 발급 동시성 테스트 (PowerShell)
```powershell
# 100개 쿠폰에 200명이 동시 발급 시도
1..200 | ForEach-Object -Parallel {
    $userId = $_
    curl -X POST "http://localhost:3001/api/coupons/issue?strategy=v2" `
      -H "Content-Type: application/json" `
      -d "{\"policyId\":\"1\",\"userId\":\"$userId\"}"
} -ThrottleLimit 50
```

### 타임세일 주문 동시성 테스트 (PowerShell)
```powershell
# 100개 재고에 200명이 동시 주문 시도
1..200 | ForEach-Object -Parallel {
    $userId = $_
    curl -X POST "http://localhost:3003/api/timesales/1/orders?strategy=v2" `
      -H "Content-Type: application/json" `
      -d "{\"userId\":\"$userId\",\"quantity\":1}"
} -ThrottleLimit 50
```

---

## 성능 비교 테스트

### V1 vs V2 성능 비교
```bash
# V1 (DB 기반) - 10회 연속 요청
for i in {1..10}; do
  time curl -X POST "http://localhost:3001/api/coupons/issue?strategy=v1" \
    -H "Content-Type: application/json" \
    -d "{\"policyId\":\"1\",\"userId\":\"$i\"}"
done

# V2 (Redis 기반) - 10회 연속 요청
for i in {11..20}; do
  time curl -X POST "http://localhost:3001/api/coupons/issue?strategy=v2" \
    -H "Content-Type: application/json" \
    -d "{\"policyId\":\"1\",\"userId\":\"$i\"}"
done
```

---

## Redis 캐시 확인

```bash
# Redis CLI 접속
docker exec -it redis redis-cli

# 쿠폰 발급 수량 확인
GET coupon:issued:1

# 적립금 캐시 확인
GET point:balance:1001

# 타임세일 재고 확인
GET timesale:stock:1

# 모든 키 확인
KEYS *
```

---

## 데이터 정합성 검증

### 쿠폰 발급 수량 검증
```sql
-- MySQL coupon_db
SELECT COUNT(*) as issued_count FROM coupons WHERE coupon_policy_id = 1;
SELECT total_quantity FROM coupon_policies WHERE id = 1;
```

### 적립금 잔액 검증
```sql
-- MySQL point_db
SELECT balance FROM point_balances WHERE user_id = 1001;
SELECT SUM(CASE WHEN type = 'EARNED' THEN amount ELSE -amount END) as calculated_balance
FROM points WHERE user_id = 1001;
```

### 타임세일 재고 검증
```sql
-- MySQL timesale_db
SELECT quantity, remaining_quantity FROM time_sales WHERE id = 1;
SELECT COUNT(*) as order_count, SUM(quantity) as total_ordered
FROM time_sale_orders WHERE time_sale_id = 1 AND status = 'CONFIRMED';
```

---

## 문제 해결

### 서비스가 시작되지 않는 경우
```bash
# 포트 사용 확인
netstat -ano | findstr :3001
netstat -ano | findstr :3002
netstat -ano | findstr :3003

# 프로세스 종료
taskkill /PID <PID> /F
```

### Prisma 클라이언트 오류
```bash
cd apps/[service-name]
npx prisma generate
```

### Redis 연결 오류
```bash
docker-compose restart redis
```
