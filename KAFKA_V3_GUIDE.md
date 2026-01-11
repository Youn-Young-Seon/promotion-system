# Kafka V3 구현 가이드

## 개요

Kafka를 활용한 비동기 메시지 큐 시스템으로 대규모 트래픽을 처리합니다.

---

## 아키텍처

```
[Client Request] 
    ↓
[API Server] → [Kafka Producer] → [Kafka Topic]
    ↓ (즉시 응답)                      ↓
[Client]                        [Kafka Consumer]
                                       ↓
                                [실제 처리]
                                       ↓
                                [DB/Redis 업데이트]
```

---

## Coupon Service V3

### 토픽 구조
- `coupon-issue-requests`: 쿠폰 발급 요청
- `coupon-issue-success`: 발급 성공 알림
- `coupon-issue-failures`: 발급 실패 알림

### API 사용법

```bash
# V3 비동기 쿠폰 발급
curl -X POST "http://localhost:3001/api/coupons/issue?strategy=v3" \
  -H "Content-Type: application/json" \
  -d '{
    "policyId": "1",
    "userId": "1001"
  }'

# 응답 (즉시 반환)
{
  "status": "PENDING",
  "message": "쿠폰 발급 요청이 접수되었습니다. 잠시 후 확인해주세요.",
  "policyId": "1",
  "userId": "1001"
}
```

### 처리 흐름

1. **요청 접수** (즉시 응답)
   - 기본 검증 (정책 존재, 발급 시간, 중복 확인)
   - Kafka 토픽에 메시지 전송
   - `PENDING` 상태로 즉시 응답

2. **비동기 처리** (Consumer)
   - Redis 분산 락 획득
   - 재고 확인 및 차감
   - 쿠폰 발급
   - 성공/실패 알림

---

## Time Sale Service V3

### 토픽 구조
- `timesale-order-requests`: 주문 요청
- `timesale-order-success`: 주문 성공 알림
- `timesale-order-failures`: 주문 실패 알림

### API 사용법

```bash
# V3 대기열 기반 주문
curl -X POST "http://localhost:3003/api/timesales/1/orders?strategy=v3" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "1001",
    "quantity": 1
  }'

# 응답 (즉시 반환)
{
  "status": "QUEUED",
  "message": "주문 요청이 대기열에 등록되었습니다. 순차적으로 처리됩니다.",
  "timeSaleId": "1",
  "userId": "1001",
  "queuePosition": "Processing..."
}
```

### 처리 흐름

1. **요청 접수** (즉시 응답)
   - 기본 검증 (타임세일 존재, 판매 시간)
   - Kafka 토픽에 메시지 전송
   - `QUEUED` 상태로 즉시 응답

2. **순차 처리** (Consumer)
   - Redis 원자적 재고 차감
   - 주문 생성
   - 성공/실패 알림
   - 비동기 DB 업데이트

---

## 성능 비교

| 전략 | 응답 시간 | 처리량 (TPS) | 특징 |
|------|----------|-------------|------|
| **V1** | ~200ms | ~100 | DB 트랜잭션, 동기 처리 |
| **V2** | ~100ms | ~500 | Redis 분산 락, 동기 처리 |
| **V3** | ~10ms | ~5000+ | Kafka 비동기, 즉시 응답 |

---

## Kafka 토픽 모니터링

### 토픽 확인
```bash
# Kafka 컨테이너 접속
docker exec -it kafka bash

# 토픽 목록
kafka-topics --bootstrap-server localhost:9092 --list

# 토픽 상세 정보
kafka-topics --bootstrap-server localhost:9092 --describe --topic coupon-issue-requests

# 메시지 확인
kafka-console-consumer --bootstrap-server localhost:9092 \
  --topic coupon-issue-requests --from-beginning
```

### Consumer Group 확인
```bash
# Consumer Group 목록
kafka-consumer-groups --bootstrap-server localhost:9092 --list

# Consumer Group 상세
kafka-consumer-groups --bootstrap-server localhost:9092 \
  --describe --group coupon-service-group
```

---

## 장애 처리

### Dead Letter Queue (DLQ)
실패한 메시지는 별도 토픽으로 전송하여 재처리 가능:
- `coupon-issue-dlq`
- `timesale-order-dlq`

### 재시도 전략
- Consumer에서 에러 발생 시 자동 재시도
- 최대 3회 재시도 후 DLQ로 전송
- 수동 재처리 가능

---

## 부하 테스트

### 동시 요청 테스트 (PowerShell)
```powershell
# 1000명이 동시에 쿠폰 발급 요청
1..1000 | ForEach-Object -Parallel {
    $userId = $_
    curl -X POST "http://localhost:3001/api/coupons/issue?strategy=v3" `
      -H "Content-Type: application/json" `
      -d "{\"policyId\":\"1\",\"userId\":\"$userId\"}"
} -ThrottleLimit 100
```

### 예상 결과
- **V1/V2**: 타임아웃 발생, 일부 실패
- **V3**: 모든 요청 즉시 응답 (PENDING), 순차 처리

---

## 환경 변수

```env
# Kafka 설정
KAFKA_BROKERS=localhost:9092
KAFKA_CLIENT_ID=promotion-system

# Consumer 설정
KAFKA_GROUP_ID=coupon-service-group
```

---

## 주의사항

1. **멱등성**: 동일 요청 중복 처리 방지 필요
2. **순서 보장**: Kafka 파티션 키 설정으로 순서 보장
3. **모니터링**: Consumer Lag 모니터링 필수
4. **스케일링**: Consumer 인스턴스 증가로 처리량 향상

---

**작성일**: 2026-01-11  
**버전**: 1.0
