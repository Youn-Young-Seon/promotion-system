# API 가이드 및 테스트

프로모션 시스템 API 사용 가이드

## 서비스 엔드포인트

- **Coupon Service**: http://localhost:3001
- **Point Service**: http://localhost:3002
- **TimeSale Service**: http://localhost:3003

---

## 1. Coupon Service API

### 1.1 쿠폰 정책 생성

```bash
curl -X POST http://localhost:3001/api/v1/coupon-policies \
  -H "Content-Type: application/json" \
  -d '{
    "title": "설날 특가 쿠폰",
    "description": "설날 기념 최대 50% 할인",
    "totalQuantity": 1000,
    "startTime": "2026-01-26T00:00:00Z",
    "endTime": "2026-02-05T23:59:59Z",
    "discountType": "PERCENTAGE",
    "discountValue": 50,
    "minimumOrderAmount": 10000,
    "maximumDiscountAmount": 50000
  }'
```

**응답 예시:**
```json
{
  "id": "1",
  "title": "설날 특가 쿠폰",
  "totalQuantity": 1000,
  "issuedQuantity": 0,
  "discountType": "PERCENTAGE",
  "discountValue": 50
}
```

### 1.2 쿠폰 정책 조회

```bash
# 특정 정책 조회
curl http://localhost:3001/api/v1/coupon-policies/1

# 전체 목록 조회 (페이지네이션)
curl "http://localhost:3001/api/v1/coupon-policies?page=0&size=10"
```

### 1.3 쿠폰 발급

```bash
curl -X POST http://localhost:3001/api/v1/coupons/issue \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 123,
    "couponPolicyId": 1
  }'
```

**응답 예시:**
```json
{
  "id": "1",
  "userId": "123",
  "status": "AVAILABLE",
  "expirationTime": "2026-02-05T23:59:59Z",
  "issuedAt": "2026-01-25T10:00:00Z",
  "couponPolicy": {
    "id": "1",
    "title": "설날 특가 쿠폰"
  }
}
```

### 1.4 쿠폰 사용

```bash
curl -X POST http://localhost:3001/api/v1/coupons/1/use \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": 1001,
    "orderAmount": 50000
  }'
```

### 1.5 쿠폰 취소

```bash
curl -X POST http://localhost:3001/api/v1/coupons/1/cancel
```

### 1.6 사용자 쿠폰 조회

```bash
curl http://localhost:3001/api/v1/coupons/user/123
```

---

## 2. Point Service API

### 2.1 적립금 적립

```bash
curl -X POST http://localhost:3002/api/v1/points/earn \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 123,
    "amount": 5000,
    "description": "상품 구매 적립"
  }'
```

**응답 예시:**
```json
{
  "id": "1",
  "userId": "123",
  "amount": "5000",
  "type": "EARNED",
  "description": "상품 구매 적립",
  "balanceSnapshot": "5000",
  "createdAt": "2026-01-25T10:00:00Z"
}
```

### 2.2 적립금 사용

```bash
curl -X POST http://localhost:3002/api/v1/points/use \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 123,
    "amount": 3000,
    "description": "상품 구매 시 사용"
  }'
```

### 2.3 적립금 취소

```bash
curl -X POST http://localhost:3002/api/v1/points/cancel \
  -H "Content-Type: application/json" \
  -d '{
    "transactionId": 1,
    "description": "주문 취소로 인한 포인트 복원"
  }'
```

### 2.4 잔액 조회 (Redis 캐싱 적용)

```bash
curl http://localhost:3002/api/v1/points/users/123/balance
```

**응답 예시:**
```json
{
  "userId": 123,
  "balance": 2000
}
```

### 2.5 거래 내역 조회

```bash
curl "http://localhost:3002/api/v1/points/users/123/history?page=0&size=10"
```

**응답 예시:**
```json
{
  "points": [
    {
      "id": "2",
      "amount": "-3000",
      "type": "SPENT",
      "description": "상품 구매 시 사용",
      "balanceSnapshot": "2000",
      "createdAt": "2026-01-25T10:05:00Z"
    },
    {
      "id": "1",
      "amount": "5000",
      "type": "EARNED",
      "description": "상품 구매 적립",
      "balanceSnapshot": "5000",
      "createdAt": "2026-01-25T10:00:00Z"
    }
  ],
  "total": 2
}
```

---

## 3. Time Sale Service API

### 3.1 상품 등록

```bash
curl -X POST http://localhost:3003/api/v1/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "갤럭시 S25 Ultra",
    "price": 1500000,
    "description": "최신 플래그십 스마트폰"
  }'
```

**응답 예시:**
```json
{
  "id": "1",
  "name": "갤럭시 S25 Ultra",
  "price": 1500000,
  "description": "최신 플래그십 스마트폰",
  "createdAt": "2026-01-25T10:00:00Z"
}
```

### 3.2 상품 조회

```bash
curl http://localhost:3003/api/v1/products/1
```

### 3.3 타임세일 생성

```bash
curl -X POST http://localhost:3003/api/v1/time-sales \
  -H "Content-Type: application/json" \
  -d '{
    "productId": 1,
    "quantity": 100,
    "discountPrice": 999000,
    "startAt": "2026-01-25T12:00:00Z",
    "endAt": "2026-01-25T18:00:00Z"
  }'
```

**응답 예시:**
```json
{
  "id": "1",
  "productId": "1",
  "quantity": 100,
  "remainingQuantity": 100,
  "discountPrice": 999000,
  "startAt": "2026-01-25T12:00:00Z",
  "endAt": "2026-01-25T18:00:00Z",
  "status": "ACTIVE",
  "product": {
    "id": "1",
    "name": "갤럭시 S25 Ultra"
  }
}
```

### 3.4 타임세일 목록 조회

```bash
# 전체 조회
curl "http://localhost:3003/api/v1/time-sales?page=0&size=10"

# 상태별 조회
curl "http://localhost:3003/api/v1/time-sales?status=ACTIVE&page=0&size=10"
```

### 3.5 주문 생성 (Redis 재고 관리 적용)

```bash
curl -X POST http://localhost:3003/api/v1/orders \
  -H "Content-Type: application/json" \
  -d '{
    "timeSaleId": 1,
    "userId": 123,
    "quantity": 1
  }'
```

**응답 예시:**
```json
{
  "id": "1",
  "timeSaleId": "1",
  "userId": "123",
  "quantity": 1,
  "status": "COMPLETED",
  "queueNumber": 0,
  "createdAt": "2026-01-25T12:01:00Z",
  "timeSale": {
    "id": "1",
    "discountPrice": 999000,
    "product": {
      "name": "갤럭시 S25 Ultra"
    }
  }
}
```

### 3.6 주문 조회

```bash
curl http://localhost:3003/api/v1/orders/1
```

---

## 4. 부하 테스트 시나리오

### 4.1 쿠폰 발급 동시성 테스트

```bash
# 100개의 동시 요청으로 쿠폰 발급 테스트
for i in {1..100}; do
  curl -X POST http://localhost:3001/api/v1/coupons/issue \
    -H "Content-Type: application/json" \
    -d "{\"userId\": $i, \"couponPolicyId\": 1}" &
done
wait
```

### 4.2 포인트 잔액 조회 캐싱 테스트

```bash
# 연속 조회로 Redis 캐싱 효과 확인
time curl http://localhost:3002/api/v1/points/users/123/balance  # 첫 조회 (DB)
time curl http://localhost:3002/api/v1/points/users/123/balance  # 캐시 조회 (Redis)
```

### 4.3 타임세일 재고 소진 테스트

```bash
# 200개의 동시 주문으로 재고 100개 소진 테스트
for i in {1..200}; do
  curl -X POST http://localhost:3003/api/v1/orders \
    -H "Content-Type: application/json" \
    -d "{\"timeSaleId\": 1, \"userId\": $i, \"quantity\": 1}" &
done
wait
```

---

## 5. Kafka 이벤트 모니터링

### Kafka 토픽 확인

```bash
# Kafka 컨테이너 접속
docker exec -it kafka bash

# 토픽 목록 조회
kafka-topics --bootstrap-server localhost:9092 --list

# 쿠폰 발급 이벤트 구독
kafka-console-consumer --bootstrap-server localhost:9092 \
  --topic coupon.issued \
  --from-beginning

# 포인트 적립 이벤트 구독
kafka-console-consumer --bootstrap-server localhost:9092 \
  --topic point.earned \
  --from-beginning

# 주문 생성 이벤트 구독
kafka-console-consumer --bootstrap-server localhost:9092 \
  --topic order.created \
  --from-beginning
```

---

## 6. Redis 모니터링

### Redis 데이터 확인

```bash
# Redis CLI 접속
docker exec -it redis redis-cli

# 모든 키 조회
KEYS *

# 포인트 잔액 캐시 확인
GET point:balance:123

# 타임세일 재고 확인
GET timesale:inventory:1

# 분산 락 확인
KEYS lock:*
```

---

## 7. 에러 케이스 테스트

### 7.1 쿠폰 품절

```bash
# 수량 초과 발급 시도
curl -X POST http://localhost:3001/api/v1/coupons/issue \
  -H "Content-Type: application/json" \
  -d '{"userId": 999, "couponPolicyId": 1}'
```

**응답:**
```json
{
  "statusCode": 400,
  "message": "Coupon sold out"
}
```

### 7.2 포인트 부족

```bash
# 잔액보다 많은 포인트 사용 시도
curl -X POST http://localhost:3002/api/v1/points/use \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 123,
    "amount": 999999,
    "description": "과다 사용 시도"
  }'
```

**응답:**
```json
{
  "statusCode": 400,
  "message": "Insufficient points. Available: 2000, Requested: 999999"
}
```

### 7.3 타임세일 재고 부족

```bash
# 재고 소진 후 주문 시도
curl -X POST http://localhost:3003/api/v1/orders \
  -H "Content-Type: application/json" \
  -d '{
    "timeSaleId": 1,
    "userId": 999,
    "quantity": 1
  }'
```

**응답:**
```json
{
  "statusCode": 400,
  "message": "Insufficient stock. Available: 0, Requested: 1"
}
```

---

## 8. 성능 벤치마크

### Apache Bench를 사용한 부하 테스트

```bash
# 포인트 잔액 조회 (Redis 캐싱)
ab -n 10000 -c 100 http://localhost:3002/api/v1/points/users/123/balance

# 쿠폰 정책 조회
ab -n 10000 -c 100 http://localhost:3001/api/v1/coupon-policies/1

# 타임세일 목록 조회
ab -n 10000 -c 100 http://localhost:3003/api/v1/time-sales
```

### 성능 목표

- **처리량**: 초당 1,000건 이상
- **응답 시간**: 평균 100ms 이하
- **동시 접속**: 100명 이상 처리

---

## 9. 데이터베이스 확인

```bash
# Coupon Service DB 접속
docker exec -it postgres-coupon psql -U postgres -d coupon_db

# 쿠폰 정책 확인
SELECT * FROM coupon_policies;

# 발급된 쿠폰 수 확인
SELECT count(*) FROM coupons WHERE status = 'AVAILABLE';

# Point Service DB 접속
docker exec -it postgres-point psql -U postgres -d point_db

# 포인트 잔액 확인
SELECT * FROM point_balances;

# 거래 내역 확인
SELECT * FROM points ORDER BY created_at DESC LIMIT 10;

# TimeSale Service DB 접속
docker exec -it postgres-timesale psql -U postgres -d timesale_db

# 타임세일 확인
SELECT * FROM time_sales;

# 주문 확인
SELECT * FROM time_sale_orders ORDER BY created_at DESC LIMIT 10;
```

---

## 10. 트러블슈팅

### 서비스 로그 확인

```bash
# 각 서비스의 로그 실시간 확인
# (서비스가 실행 중인 터미널에서 확인 가능)

# Docker 로그 확인 (인프라)
docker-compose logs -f redis
docker-compose logs -f kafka
docker-compose logs -f postgres-coupon
```

### 서비스 재시작

```bash
# 특정 서비스만 재시작 (Ctrl+C 후 다시 실행)
cd apps/coupon-service
pnpm start:dev

# 전체 인프라 재시작
docker-compose restart
```

### 데이터 초기화

```bash
# Prisma 마이그레이션 리셋
cd apps/coupon-service
pnpm prisma migrate reset

# Redis 데이터 삭제
docker exec -it redis redis-cli FLUSHALL
```
