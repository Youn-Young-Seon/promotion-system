# API Gateway 사용 가이드

## 개요

API Gateway는 프로모션 시스템의 통합 진입점으로, 3개의 마이크로서비스(Coupon, Point, TimeSale)에 대한 요청을 라우팅합니다.

**포트**: 4000  
**Swagger 문서**: http://localhost:4000/api/docs

---

## 라우팅 규칙

API Gateway는 URL 경로를 기반으로 요청을 해당 마이크로서비스로 라우팅합니다:

| 경로 패턴 | 대상 서비스 | 포트 |
|----------|-----------|------|
| `/api/coupons/*` | Coupon Service | 3001 |
| `/api/points/*` | Point Service | 3002 |
| `/api/timesales/*` | Time Sale Service | 3003 |
| `/api/health` | Gateway Health Check | 4000 |

### 예제 요청

```bash
# Coupon Service (Gateway 경유)
curl http://localhost:4000/api/coupons/policies

# Point Service (Gateway 경유)
curl http://localhost:4000/api/points/user/1

# Time Sale Service (Gateway 경유)
curl http://localhost:4000/api/timesales

# Health Check
curl http://localhost:4000/api/health
```

---

## Rate Limiting

API Gateway는 IP 기반 Rate Limiting을 적용합니다.

### 기본 설정

- **최대 요청 수**: 100 req/min per IP
- **윈도우 시간**: 60초
- **제외 경로**: `/api/health`

### 응답 헤더

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
```

### Rate Limit 초과 시

```json
{
  "statusCode": 429,
  "message": "Too Many Requests",
  "error": "Rate Limit Exceeded",
  "retryAfter": 60
}
```

### 설정 변경

`.env` 파일에서 설정을 변경할 수 있습니다:

```env
RATE_LIMIT_MAX=200        # 최대 요청 수
RATE_LIMIT_WINDOW=60      # 윈도우 시간 (초)
```

---

## Health Check

### Gateway Health Check

```bash
curl http://localhost:4000/api/health
```

**응답 예시**:
```json
{
  "status": "ok",
  "timestamp": "2026-01-14T07:00:00.000Z",
  "gateway": {
    "name": "api-gateway",
    "status": "up",
    "port": 4000
  },
  "services": [
    { "name": "coupon", "status": "up", "url": "http://localhost:3001" },
    { "name": "point", "status": "up", "url": "http://localhost:3002" },
    { "name": "timesale", "status": "up", "url": "http://localhost:3003" }
  ]
}
```

### 개별 서비스 Health Check

```bash
# Coupon Service (직접 접근)
curl http://localhost:3001/api/health

# Point Service (직접 접근)
curl http://localhost:3002/api/health

# Time Sale Service (직접 접근)
curl http://localhost:3003/api/health
```

---

## 로깅

API Gateway는 모든 요청을 자동으로 로깅합니다.

### 로그 형식

```
[HTTP] GET /api/coupons/policies 200 1234b - 45ms - ::1 Mozilla/5.0...
```

**포함 정보**:
- HTTP 메서드
- 요청 경로
- 상태 코드
- 응답 크기
- 응답 시간
- 클라이언트 IP
- User Agent

### 로그 레벨

- **200-299**: `LOG` (정상)
- **400-499**: `WARN` (클라이언트 오류)
- **500-599**: `ERROR` (서버 오류)

---

## 환경 변수

### Gateway 설정

```env
# Gateway 포트
GATEWAY_PORT=4000

# 마이크로서비스 URL
COUPON_SERVICE_URL=http://localhost:3001
POINT_SERVICE_URL=http://localhost:3002
TIMESALE_SERVICE_URL=http://localhost:3003

# Rate Limiting
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=60

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
```

---

## 개발 모드

### Gateway만 실행

```bash
npm run start:gateway
```

### 모든 서비스 실행 (Gateway 포함)

```bash
npm run start:all
```

이 명령은 다음 서비스를 동시에 실행합니다:
- API Gateway (포트 4000)
- Coupon Service (포트 3001)
- Point Service (포트 3002)
- Time Sale Service (포트 3003)

---

## 프로덕션 배포

### Docker Compose

```yaml
services:
  api-gateway:
    build:
      context: .
      dockerfile: apps/api-gateway/Dockerfile
    ports:
      - "4000:4000"
    environment:
      - GATEWAY_PORT=4000
      - COUPON_SERVICE_URL=http://coupon-service:3001
      - POINT_SERVICE_URL=http://point-service:3002
      - TIMESALE_SERVICE_URL=http://timesale-service:3003
      - REDIS_HOST=redis
    depends_on:
      - coupon-service
      - point-service
      - timesale-service
      - redis
```

---

## 트러블슈팅

### 1. Gateway가 시작되지 않음

**증상**: `nest start api-gateway --watch` 실행 시 오류

**해결**:
```bash
# 빌드 확인
nest build api-gateway

# 의존성 확인
pnpm install
```

### 2. 502 Bad Gateway 오류

**증상**: Gateway를 통한 요청이 502 오류 반환

**원인**: 대상 마이크로서비스가 실행되지 않음

**해결**:
```bash
# 모든 서비스 상태 확인
curl http://localhost:4000/api/health

# 개별 서비스 직접 확인
curl http://localhost:3001/api/health
curl http://localhost:3002/api/health
curl http://localhost:3003/api/health
```

### 3. Rate Limit 오류

**증상**: 429 Too Many Requests 오류

**해결**:
- 1분 대기 후 재시도
- 또는 `.env`에서 `RATE_LIMIT_MAX` 값 증가

### 4. Redis 연결 오류

**증상**: Rate Limiting이 작동하지 않음

**해결**:
```bash
# Redis 실행 확인
docker-compose ps redis

# Redis 재시작
docker-compose restart redis
```

---

## 모니터링

### 주요 메트릭

- **요청 수**: 로그에서 확인
- **응답 시간**: 로그의 `ms` 값
- **Rate Limit 상태**: `X-RateLimit-Remaining` 헤더
- **서비스 상태**: `/api/health` 엔드포인트

### 권장 모니터링 도구

- **로그 수집**: Winston (이미 구현됨)
- **메트릭**: Prometheus + Grafana (선택사항)
- **APM**: New Relic, Datadog (선택사항)

---

## API 문서

### Swagger UI

**URL**: http://localhost:4000/api/docs

Swagger UI에서 다음을 확인할 수 있습니다:
- 모든 API 엔드포인트
- 요청/응답 스키마
- Try it out 기능으로 직접 테스트

### 개별 서비스 문서

직접 접근이 필요한 경우:
- Coupon Service: http://localhost:3001/api/docs
- Point Service: http://localhost:3002/api/docs
- Time Sale Service: http://localhost:3003/api/docs

---

## 보안 고려사항

### CORS

Gateway는 CORS를 활성화하고 있습니다. 프로덕션 환경에서는 특정 도메인만 허용하도록 설정하세요:

```typescript
// main.ts
app.enableCors({
  origin: ['https://your-domain.com'],
  credentials: true,
});
```

### Rate Limiting

현재 IP 기반 Rate Limiting을 사용합니다. 추가 보안이 필요한 경우:
- API Key 기반 인증 추가
- JWT 토큰 검증
- IP 화이트리스트

---

## 다음 단계

### 선택적 개선 사항

1. **Circuit Breaker**: Opossum을 사용한 장애 격리
2. **Service Discovery**: etcd를 사용한 동적 서비스 검색
3. **API Key 인증**: 외부 API 접근 제어
4. **Request/Response 변환**: 공통 응답 형식 적용

---

**문서 버전**: 1.0.0  
**최종 업데이트**: 2026-01-14
