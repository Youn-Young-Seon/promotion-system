# etcd 서비스 디스커버리 통합 가이드

etcd 기반 서비스 디스커버리가 프로모션 시스템에 통합되었습니다.

---

## 📋 개요

이 시스템은 etcd를 사용하여 마이크로서비스를 자동으로 등록하고 발견합니다. API Gateway는 etcd에서 서비스 정보를 동적으로 조회하여 gRPC 연결을 설정합니다.

### 주요 기능

- **자동 서비스 등록**: 각 마이크로서비스가 시작될 때 자동으로 etcd에 등록
- **동적 서비스 발견**: API Gateway가 etcd에서 서비스 엔드포인트를 동적으로 조회
- **서비스 상태 감시**: etcd watch를 통해 서비스 변경 사항을 실시간 감지
- **자동 재연결**: 서비스 인스턴스가 변경되면 자동으로 gRPC 클라이언트 재연결
- **Lease 기반 TTL**: 서비스가 종료되면 자동으로 etcd에서 제거 (10초 TTL)

---

## 🏗️ 아키텍처

### 서비스 등록 흐름

```
Service Startup
  │
  ├─> EtcdService.registerService()
  │     │
  │     ├─> Create Lease (TTL: 10s)
  │     ├─> Register to etcd
  │     │     Key: /services/<service-name>/<host>:<port>
  │     │     Value: { host, port, protocol: "grpc" }
  │     └─> Keep-alive (자동 갱신)
  │
  └─> Service Running
```

### 서비스 발견 흐름

```
API Gateway Startup
  │
  ├─> DynamicGrpcClientService.onModuleInit()
  │     │
  │     ├─> Discover Services from etcd
  │     │     └─> EtcdService.discoverService('coupon-service')
  │     │           Returns: [{ host: 'localhost', port: 50051, protocol: 'grpc' }]
  │     │
  │     ├─> Create gRPC Clients
  │     │     └─> ClientProxyFactory.create(url: 'localhost:50051')
  │     │
  │     └─> Watch Service Changes
  │           └─> EtcdService.watchService('coupon-service', callback)
  │                 On Change: Reconnect gRPC Client
  │
  └─> API Gateway Ready
```

---

## 📁 구현된 파일

### 1. 공통 라이브러리

#### `libs/common/src/etcd/etcd.service.ts`
- etcd 클라이언트 관리
- 서비스 등록 (`registerService`)
- 서비스 발견 (`discoverService`)
- 서비스 감시 (`watchService`)

#### `libs/common/src/etcd/etcd.module.ts`
- EtcdService를 제공하는 NestJS 모듈

### 2. 마이크로서비스

각 서비스에 다음 변경사항이 적용되었습니다:

#### `apps/coupon-service/src/app.module.ts`
- EtcdModule 추가

#### `apps/coupon-service/src/main.ts`
- 서비스 시작 후 etcd에 자동 등록
- 환경 변수: `SERVICE_NAME`, `SERVICE_HOST`, `GRPC_PORT`

#### 동일한 변경사항:
- `apps/point-service/`
- `apps/timesale-service/`

### 3. API Gateway

#### `apps/api-gateway/src/common/dynamic-grpc-client.service.ts`
- etcd 기반 동적 gRPC 클라이언트 관리
- 서비스 발견 및 자동 재연결
- 편의 메서드: `getCouponClient()`, `getPointClient()`, `getTimeSaleClient()`

#### `apps/api-gateway/src/app.module.ts`
- EtcdModule 추가
- DynamicGrpcClientService 제공
- 정적 gRPC 클라이언트 제거

#### 컨트롤러 변경
- `apps/api-gateway/src/gateway/coupon/coupon-gateway.controller.ts`
- `apps/api-gateway/src/gateway/point/point-gateway.controller.ts`
- `apps/api-gateway/src/gateway/timesale/timesale-gateway.controller.ts`

모든 컨트롤러가 `@Inject('SERVICE_NAME')` 대신 `DynamicGrpcClientService`를 주입받도록 변경

---

## 🚀 사용 방법

### 1. 환경 변수 설정

각 마이크로서비스의 `.env` 파일:

```env
# Coupon Service (.env)
SERVICE_NAME=coupon-service
SERVICE_HOST=localhost
SERVICE_PORT=3001
GRPC_PORT=50051
ETCD_HOSTS=localhost:2379
```

```env
# Point Service (.env)
SERVICE_NAME=point-service
SERVICE_HOST=localhost
SERVICE_PORT=3002
GRPC_PORT=50052
ETCD_HOSTS=localhost:2379
```

```env
# TimeSale Service (.env)
SERVICE_NAME=timesale-service
SERVICE_HOST=localhost
SERVICE_PORT=3003
GRPC_PORT=50053
ETCD_HOSTS=localhost:2379
```

API Gateway `.env`:
```env
ETCD_HOSTS=localhost:2379
```

### 2. 서비스 시작

#### 방법 1: 개별 실행
```bash
# 1. 인프라 시작 (etcd 포함)
docker-compose up -d

# 2. 마이크로서비스 시작
pnpm dev:coupon
pnpm dev:point
pnpm dev:timesale

# 3. API Gateway 시작
pnpm dev:gateway
```

#### 방법 2: 전체 실행 (권장)
```bash
# 인프라 시작
docker-compose up -d

# 모든 서비스 동시 실행
pnpm dev:all
```

---

## 🔍 동작 확인

### 1. etcd에 등록된 서비스 확인

```bash
# etcd CLI 접속
docker exec -it etcd etcdctl get /services/ --prefix

# 예상 출력:
# /services/coupon-service/localhost:50051
# {"host":"localhost","port":50051,"protocol":"grpc"}
# /services/point-service/localhost:50052
# {"host":"localhost","port":50052,"protocol":"grpc"}
# /services/timesale-service/localhost:50053
# {"host":"localhost","port":50053,"protocol":"grpc"}
```

### 2. 로그 확인

#### 마이크로서비스 로그
서비스가 시작되면 다음 로그가 출력되어야 합니다:
```
[Nest] INFO [EtcdService] etcd client initialized successfully
[Nest] INFO [Bootstrap] Coupon Service (REST) is running on port 3001
[Nest] INFO [Bootstrap] Coupon Service (gRPC) is running on port 50051
[Nest] INFO [EtcdService] Service registered: coupon-service at localhost:50051
[Nest] INFO [Bootstrap] Service registered to etcd: coupon-service at localhost:50051
```

#### API Gateway 로그
API Gateway가 시작되면 다음 로그가 출력되어야 합니다:
```
[Nest] INFO [EtcdService] etcd client initialized successfully
[Nest] INFO [DynamicGrpcClientService] Connected to coupon-service at localhost:50051
[Nest] INFO [DynamicGrpcClientService] Connected to point-service at localhost:50052
[Nest] INFO [DynamicGrpcClientService] Connected to timesale-service at localhost:50053
[Nest] INFO [DynamicGrpcClientService] Watching service: coupon-service
[Nest] INFO [DynamicGrpcClientService] Watching service: point-service
[Nest] INFO [DynamicGrpcClientService] Watching service: timesale-service
```

### 3. API 테스트

API Gateway를 통해 정상적으로 요청이 처리되는지 확인:

```bash
# 쿠폰 정책 생성
curl -X POST http://localhost:4000/coupon-policies \
  -H "Content-Type: application/json" \
  -d '{
    "title": "테스트 쿠폰",
    "description": "설명",
    "totalQuantity": 100,
    "startTime": "2026-01-27T00:00:00Z",
    "endTime": "2026-02-05T23:59:59Z",
    "discountType": "PERCENTAGE",
    "discountValue": 50,
    "minimumOrderAmount": 10000,
    "maximumDiscountAmount": 50000
  }'
```

---

## 🧪 서비스 재시작 테스트

동적 재연결이 정상적으로 작동하는지 테스트:

### 시나리오 1: 서비스 재시작

1. Coupon Service 중지
```bash
# Coupon Service 프로세스 종료
```

2. API Gateway 로그 확인
```
[Nest] WARN [DynamicGrpcClientService] Service coupon-service instances changed: 0 instances
```

3. Coupon Service 재시작
```bash
pnpm dev:coupon
```

4. API Gateway 로그 확인
```
[Nest] INFO [DynamicGrpcClientService] Service coupon-service instances changed: 1 instances
[Nest] INFO [DynamicGrpcClientService] Reconnecting to coupon-service at localhost:50051
[Nest] INFO [DynamicGrpcClientService] Connected to coupon-service at localhost:50051
```

5. API 테스트로 정상 동작 확인

### 시나리오 2: 새 인스턴스 추가

1. 다른 포트로 Coupon Service 추가 실행
```bash
# .env 파일 복사 후 포트 변경
GRPC_PORT=50054 pnpm dev:coupon
```

2. API Gateway가 새 인스턴스를 감지하는지 확인

---

## ⚙️ 설정

### etcd TTL 변경

서비스 등록 시 TTL(Time To Live)을 변경하려면:

```typescript
// apps/coupon-service/src/main.ts
await etcdService.registerService(serviceName, {
  host: serviceHost,
  port: Number(grpcPort),
  protocol: 'grpc',
}, 30); // TTL을 30초로 변경 (기본값: 10초)
```

### 여러 etcd 노드 사용

`.env` 파일:
```env
ETCD_HOSTS=etcd1:2379,etcd2:2379,etcd3:2379
```

---

## 🐛 트러블슈팅

### 문제: 서비스가 etcd에 등록되지 않음

**확인 사항:**
1. etcd가 실행 중인지 확인
   ```bash
   docker ps | grep etcd
   ```
2. 환경 변수가 올바르게 설정되었는지 확인
3. etcd 연결 로그 확인

**해결 방법:**
- etcd 재시작: `docker-compose restart etcd`
- 서비스 재시작

### 문제: API Gateway가 서비스를 찾지 못함

**확인 사항:**
1. 마이크로서비스가 먼저 시작되었는지 확인
2. etcd에 서비스가 등록되어 있는지 확인
3. API Gateway의 etcd 연결 확인

**해결 방법:**
- 시작 순서: etcd → 마이크로서비스 → API Gateway
- API Gateway 재시작

### 문제: gRPC 연결 실패

**확인 사항:**
1. gRPC 포트가 올바른지 확인
2. 방화벽이 포트를 차단하지 않는지 확인
3. 서비스가 실제로 gRPC 서버를 시작했는지 확인

**해결 방법:**
- gRPC 서버 로그 확인
- 포트 충돌 확인: `netstat -ano | findstr :50051`

---

## 📊 성능 고려사항

### etcd Watch 오버헤드

- etcd watch는 매우 경량화되어 있으며, 성능에 미치는 영향이 미미합니다
- 변경 사항이 발생할 때만 콜백이 실행됩니다

### 서비스 발견 캐싱

- 현재 구현은 메모리에 서비스 엔드포인트를 캐싱합니다
- etcd 조회는 초기 시작 시 1회만 발생합니다

### Lease Keep-Alive

- etcd3 클라이언트가 자동으로 lease를 갱신합니다
- 네트워크 오버헤드: ~1KB/10초 per service

---

## 🔮 향후 개선 사항

### 1. 로드 밸런싱

현재는 첫 번째 발견된 인스턴스만 사용합니다. 향후 다음 기능 추가 가능:
- 라운드 로빈
- 가중치 기반 라우팅
- Health check 기반 선택

### 2. 서비스 메타데이터

서비스 등록 시 추가 정보 저장:
```typescript
{
  host: 'localhost',
  port: 50051,
  protocol: 'grpc',
  version: '1.0.0',
  region: 'ap-northeast-2',
  weight: 100,
}
```

### 3. Health Check

정기적으로 서비스 상태를 확인하고 etcd에 업데이트

---

## 📚 참고 자료

- [etcd Documentation](https://etcd.io/docs/)
- [etcd3 Node.js Client](https://github.com/microsoft/etcd3)
- [NestJS Microservices](https://docs.nestjs.com/microservices/basics)
- [gRPC Node.js Guide](https://grpc.io/docs/languages/node/)

---

**작성일**: 2026-01-26
**버전**: 1.0.0
