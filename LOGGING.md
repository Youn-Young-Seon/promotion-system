# 로깅 시스템 가이드

프로모션 시스템의 구조화된 로깅 시스템 사용 가이드

---

## 📋 개요

이 프로젝트는 **Winston**을 기반으로 한 프로덕션급 로깅 시스템을 사용합니다.

### 주요 기능

- **구조화된 로그**: JSON 포맷으로 파싱 가능
- **요청 추적**: UUID 기반 요청 ID로 전체 요청 흐름 추적
- **로그 레벨**: debug, info, warn, error
- **로그 파일**: 일자별 로그 파일 자동 생성 및 로테이션
- **컨텍스트**: 서비스명, 요청 ID, 사용자 ID 자동 포함

---

## 🏗️ 아키텍처

### 로깅 구성 요소

```
┌─────────────┐
│   Request   │
└──────┬──────┘
       │
       ▼
┌──────────────────────┐
│ RequestIdMiddleware  │  ← 요청 ID 생성/전파
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ HttpLoggerInterceptor│  ← HTTP 요청/응답 로깅
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│  LoggerService       │  ← Winston 기반 로거
│  (AsyncLocalStorage) │     컨텍스트 관리
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Winston Transports   │
│ - Console            │  ← 콘솔 출력
│ - DailyRotateFile    │  ← 파일 저장
└──────────────────────┘
```

### 요청 추적 흐름

```
Client Request
  │
  ├─> API Gateway (X-Request-ID: uuid-1)
  │     │
  │     ├─> Coupon Service (gRPC metadata: uuid-1)
  │     │     └─> Database (로그: uuid-1)
  │     │
  │     └─> Point Service (gRPC metadata: uuid-1)
  │           └─> Redis (로그: uuid-1)
  │
  └─> Response (X-Request-ID: uuid-1)
```

---

## 🚀 사용 방법

### 1. 기본 로깅

서비스 어디서든 LoggerService를 주입받아 사용할 수 있습니다:

```typescript
import { Injectable } from '@nestjs/common';
import { LoggerService } from '@common/index';

@Injectable()
export class MyService {
  constructor(private readonly logger: LoggerService) {
    this.logger.setContext('MyService');
  }

  async someMethod() {
    this.logger.log('Processing started');

    try {
      // 비즈니스 로직
      this.logger.debug('Debug information', { userId: 123 });
    } catch (error) {
      this.logger.error('Processing failed', error.stack, { userId: 123 });
    }

    this.logger.log('Processing completed');
  }
}
```

### 2. 로그 레벨

#### debug
상세한 디버깅 정보 (개발 환경에서만 출력)

```typescript
this.logger.debug('Cache hit', { key: 'user:123', ttl: 300 });
```

#### log (info)
일반적인 정보 로그

```typescript
this.logger.log('User logged in', { userId: 123 });
```

#### warn
경고 (주의가 필요하지만 에러는 아님)

```typescript
this.logger.warn('Slow query detected', {
  query: 'SELECT * FROM users',
  duration: 1500
});
```

#### error
에러 (스택 트레이스 포함)

```typescript
this.logger.error('Database connection failed', error.stack, {
  host: 'localhost',
  port: 5432
});
```

### 3. HTTP 요청 로깅

HTTP 요청/응답은 자동으로 로깅됩니다:

```typescript
// 자동으로 로깅됨 (HttpLoggerInterceptor)
// 예시 로그:
{
  "level": "info",
  "message": "HTTP Request",
  "requestId": "uuid-1234",
  "service": "api-gateway",
  "method": "POST",
  "url": "/api/v1/coupons/issue",
  "statusCode": 201,
  "responseTime": "85ms",
  "ip": "::1",
  "userAgent": "Mozilla/5.0...",
  "timestamp": "2026-01-25T12:34:56.789Z"
}
```

### 4. 에러 로깅

전역 예외 필터가 자동으로 에러를 로깅합니다:

```typescript
// 에러 발생 시 자동으로 로깅됨 (GlobalExceptionFilter)
// 예시 로그:
{
  "level": "error",
  "message": "Internal Server Error: Database connection timeout",
  "requestId": "uuid-1234",
  "service": "coupon-service",
  "statusCode": 500,
  "path": "/api/v1/coupons/issue",
  "method": "POST",
  "stack": "Error: Database connection timeout\n    at ...",
  "timestamp": "2026-01-25T12:34:56.789Z"
}
```

### 5. 커스텀 로깅

비즈니스 로직에 맞는 커스텀 로깅:

```typescript
// Kafka 이벤트 로깅
this.logger.logKafkaEvent('coupon.issued', 'CouponIssued', {
  couponId: 123,
  userId: 456
});

// 느린 쿼리 로깅
this.logger.logSlowQuery('SELECT * FROM coupons WHERE ...', 1500, {
  threshold: 1000
});

// gRPC 요청 로깅
this.logger.logGrpcRequest('CouponService.IssueCoupon', {
  policyId: 1,
  userId: 123
});
```

---

## 📁 로그 파일 구조

### 파일 위치

```
logs/
├── api-gateway/
│   ├── application-2026-01-25.log       # 모든 로그
│   ├── error-2026-01-25.log             # 에러 로그만
│   ├── exceptions.log                    # 처리되지 않은 예외
│   └── rejections.log                    # Promise rejection
│
├── coupon-service/
│   ├── application-2026-01-25.log
│   ├── error-2026-01-25.log
│   ├── exceptions.log
│   └── rejections.log
│
├── point-service/
│   └── ...
│
└── timesale-service/
    └── ...
```

### 로그 로테이션

- **자동 로테이션**: 매일 자동으로 새 파일 생성
- **최대 파일 크기**: 20MB
- **보관 기간**: 14일
- **압축**: 14일 이후 자동 삭제

---

## 🔍 로그 조회 및 검색

### 1. 실시간 로그 확인

```bash
# API Gateway 로그
tail -f logs/api-gateway/application-2026-01-25.log

# 에러 로그만
tail -f logs/api-gateway/error-2026-01-25.log
```

### 2. 요청 ID로 추적

특정 요청의 전체 흐름을 추적:

```bash
# 요청 ID로 검색
grep "uuid-1234" logs/*/application-2026-01-25.log

# jq로 JSON 파싱 (프로덕션 환경)
cat logs/api-gateway/application-2026-01-25.log | grep "uuid-1234" | jq .
```

### 3. 에러 검색

```bash
# 모든 에러 로그
cat logs/*/error-2026-01-25.log

# 특정 에러 메시지 검색
grep "Database connection" logs/*/error-2026-01-25.log

# 에러 건수 확인
grep -c "level.*error" logs/*/application-2026-01-25.log
```

### 4. 성능 분석

```bash
# 느린 요청 찾기 (1초 이상)
cat logs/api-gateway/application-2026-01-25.log | \
  jq 'select(.responseTime | tonumber > 1000)'

# 평균 응답 시간 계산
cat logs/api-gateway/application-2026-01-25.log | \
  jq -r '.responseTime' | \
  sed 's/ms//' | \
  awk '{sum+=$1; count++} END {print sum/count}'
```

---

## ⚙️ 설정

### 환경 변수

```env
# 로그 레벨 (debug, info, warn, error)
LOG_LEVEL=info

# 환경 (development, production)
NODE_ENV=production
```

### 로그 레벨별 출력

| 환경 | LOG_LEVEL | 출력 |
|------|-----------|------|
| Development | debug | debug, info, warn, error |
| Development | info | info, warn, error |
| Production | info (기본) | info, warn, error |
| Production | warn | warn, error |

### 개발 환경 vs 프로덕션 환경

**개발 환경:**
- 콘솔에 컬러 출력
- 읽기 쉬운 포맷
- 파일 저장 안 함

```
2026-01-25 12:34:56 info [api-gateway][uuid-1234]: HTTP Request { method: 'POST', url: '/api/v1/coupons/issue' }
```

**프로덕션 환경:**
- JSON 포맷
- 파일로 저장
- 민감 정보 필터링

```json
{
  "level": "info",
  "message": "HTTP Request",
  "service": "api-gateway",
  "requestId": "uuid-1234",
  "method": "POST",
  "url": "/api/v1/coupons/issue",
  "timestamp": "2026-01-25T12:34:56.789Z"
}
```

---

## 🎯 Best Practices

### 1. 적절한 로그 레벨 사용

```typescript
// ✅ Good
this.logger.debug('Cache lookup', { key });  // 디버깅 정보
this.logger.log('User created', { userId }); // 중요 이벤트
this.logger.warn('Rate limit approaching', { current, max }); // 경고
this.logger.error('Payment failed', error.stack, { orderId }); // 에러

// ❌ Bad
this.logger.log('x = 5');  // 너무 상세함, debug 사용
this.logger.error('User not found');  // 예상 가능한 케이스, warn 사용
```

### 2. 구조화된 로그

```typescript
// ✅ Good - 객체로 구조화
this.logger.log('Order placed', {
  orderId: 123,
  userId: 456,
  amount: 10000,
  items: 3
});

// ❌ Bad - 문자열로만 로깅
this.logger.log(`Order ${123} placed by user ${456} with amount ${10000}`);
```

### 3. 민감 정보 제외

```typescript
// ✅ Good
this.logger.log('User authenticated', {
  userId: user.id,
  email: maskEmail(user.email)
});

// ❌ Bad
this.logger.log('User authenticated', {
  userId: user.id,
  email: user.email,
  password: user.password  // 절대 로깅 금지!
});
```

### 4. 컨텍스트 설정

```typescript
// ✅ Good
@Injectable()
export class CouponService {
  constructor(private readonly logger: LoggerService) {
    this.logger.setContext('CouponService');  // 서비스명 설정
  }
}

// ❌ Bad - 컨텍스트 없이 사용
this.logger.log('Something happened');
```

---

## 🔧 고급 기능

### 1. 요청 ID 전파

API Gateway에서 생성된 요청 ID가 모든 서비스에 전파됩니다:

```typescript
// API Gateway에서 생성
const requestId = uuid();
response.setHeader('X-Request-ID', requestId);

// gRPC 호출 시 메타데이터로 전달
const metadata = new Metadata();
metadata.set('x-request-id', requestId);
```

### 2. 사용자 컨텍스트

JWT 인증 후 사용자 ID가 자동으로 로그에 포함됩니다:

```typescript
{
  "level": "info",
  "message": "HTTP Request",
  "requestId": "uuid-1234",
  "userId": 123,  // JWT에서 자동 추출
  "method": "POST",
  "url": "/api/v1/coupons/issue"
}
```

### 3. 로그 집계 (향후)

ELK Stack 또는 다른 로그 집계 시스템과 통합 가능:

```bash
# Logstash 설정 예시
input {
  file {
    path => "/app/logs/*/application-*.log"
    codec => json
  }
}

filter {
  json {
    source => "message"
  }
}

output {
  elasticsearch {
    hosts => ["localhost:9200"]
    index => "promotion-system-%{+YYYY.MM.dd}"
  }
}
```

---

## 🐛 트러블슈팅

### 로그가 출력되지 않는 경우

1. **LOG_LEVEL 확인**
   ```bash
   echo $LOG_LEVEL
   # 또는
   cat .env | grep LOG_LEVEL
   ```

2. **Logger 주입 확인**
   ```typescript
   constructor(private readonly logger: LoggerService) {
     this.logger.setContext('MyService');
   }
   ```

3. **권한 확인**
   ```bash
   ls -la logs/
   # logs 디렉토리에 쓰기 권한이 있는지 확인
   ```

### 로그 파일이 너무 큰 경우

1. **로그 레벨 조정**
   ```env
   LOG_LEVEL=warn  # debug, info 로그 제외
   ```

2. **보관 기간 단축**
   ```typescript
   // logger.config.ts
   maxFiles: '7d'  // 14d → 7d
   ```

3. **수동 정리**
   ```bash
   # 7일 이상 된 로그 삭제
   find logs/ -name "*.log" -mtime +7 -delete
   ```

---

## 📚 참고 자료

- [Winston 공식 문서](https://github.com/winstonjs/winston)
- [NestJS Logger](https://docs.nestjs.com/techniques/logger)
- [Structured Logging Best Practices](https://www.loggly.com/blog/structured-logging-best-practices/)

---

**작성일**: 2026-01-25
**버전**: 1.0.0
