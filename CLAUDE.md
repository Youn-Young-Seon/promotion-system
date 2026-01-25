# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a high-performance, microservices-based promotion system built with NestJS. The system handles 1,000+ requests per second and consists of:
- **API Gateway** (port 4000): REST to gRPC proxy with JWT auth, rate limiting, and circuit breaker
- **Coupon Service** (port 3001): Coupon policy management with Redis distributed locking
- **Point Service** (port 3002): Point balance management with Redis caching (5-min TTL)
- **TimeSale Service** (port 3003): Time-limited sales with Redis-based inventory management

**Tech Stack**: NestJS, TypeScript, PostgreSQL (3 databases), Redis, Kafka, etcd, gRPC, Prisma, Opossum, Prometheus, Grafana

## Essential Commands

### Development Workflow
```bash
# Install dependencies
pnpm install

# Start infrastructure (PostgreSQL, Redis, Kafka, etcd, Prometheus, Grafana)
docker-compose up -d

# Database migrations (run for each service)
cd apps/coupon-service && pnpm prisma migrate dev --name init
cd apps/point-service && pnpm prisma migrate dev --name init
cd apps/timesale-service && pnpm prisma migrate dev --name init

# Generate Prisma clients
pnpm prisma:generate

# Run all services (each in separate terminal)
cd apps/api-gateway && pnpm start:dev
cd apps/coupon-service && pnpm start:dev
cd apps/point-service && pnpm start:dev
cd apps/timesale-service && pnpm start:dev

# Or run individual service
pnpm --filter api-gateway start:dev
pnpm --filter coupon-service start:dev
```

### Testing
```bash
# Unit tests
pnpm test

# Run tests for specific service
pnpm --filter coupon-service test

# Test coverage
pnpm test:cov

# E2E tests
pnpm test:e2e
```

### Performance Testing
```bash
# k6 load tests
pnpm perf:coupon      # Coupon service load test
pnpm perf:point       # Point service load test
pnpm perf:timesale    # TimeSale service load test
pnpm perf:full        # Full system test
pnpm perf:all         # All tests sequentially
```

### Code Quality
```bash
# Linting
pnpm lint

# Format code
pnpm format

# Build all services
pnpm build
```

### Database Management
```bash
# Generate Prisma client (after schema changes)
cd apps/<service-name> && pnpm prisma generate

# Create migration
cd apps/<service-name> && pnpm prisma migrate dev --name <migration-name>

# Reset database (WARNING: deletes all data)
cd apps/<service-name> && pnpm prisma migrate reset
```

## Architecture

### Monorepo Structure
```
promotion-system/
├── apps/                          # Microservices
│   ├── api-gateway/              # REST API entry point (port 4000)
│   │   ├── src/
│   │   │   ├── auth/             # JWT authentication (login, register, profile)
│   │   │   ├── gateway/          # gRPC client proxies (coupon, point, timesale)
│   │   │   ├── common/           # Circuit breaker, rate limiter
│   │   │   └── main.ts           # Swagger setup, CORS, validation pipe
│   │   └── (no Prisma - stateless)
│   ├── coupon-service/           # Coupon management (port 3001)
│   │   ├── src/
│   │   │   ├── coupon-policy/    # Policy CRUD
│   │   │   ├── coupon/           # Issue/use/cancel with Redis Redlock
│   │   │   ├── prisma/           # Prisma service
│   │   │   ├── generated/        # gRPC generated code
│   │   │   └── main.ts           # Both REST and gRPC server
│   │   └── prisma/schema.prisma
│   ├── point-service/            # Point management (port 3002)
│   │   ├── src/
│   │   │   ├── point/            # Earn/use/cancel with Redis caching
│   │   │   ├── prisma/           # Prisma service
│   │   │   ├── generated/        # gRPC generated code
│   │   │   └── main.ts
│   │   └── prisma/schema.prisma
│   └── timesale-service/         # Time sale management (port 3003)
│       ├── src/
│       │   ├── product/          # Product CRUD
│       │   ├── time-sale/        # Time sale CRUD
│       │   ├── order/            # Order processing with Redis inventory
│       │   ├── prisma/           # Prisma service
│       │   ├── generated/        # gRPC generated code
│       │   └── main.ts
│       └── prisma/schema.prisma
├── libs/common/                   # Shared libraries
│   └── src/
│       ├── redis/                # RedisModule (distributed lock, caching)
│       ├── kafka/                # KafkaModule (producer)
│       ├── etcd/                 # EtcdModule (service discovery)
│       ├── grpc/                 # gRPC utilities
│       └── logger/               # Winston logger (file + console)
└── proto/                        # gRPC Protocol Buffers
    ├── coupon.proto
    ├── point.proto
    └── timesale.proto
```

### Communication Flow
1. **Client → API Gateway**: REST requests to `http://localhost:4000/api/v1/*`
2. **API Gateway → Services**: gRPC calls via circuit breaker (Opossum)
3. **Services → Redis**: Distributed locks (coupon), caching (point), inventory (timesale)
4. **Services → Kafka**: Async event publishing (`coupon.issued`, `point.earned`, `order.created`)
5. **Services → etcd**: Service registration/discovery (gRPC endpoints)

### Database Architecture
- **3 separate PostgreSQL databases** (Database-per-Service pattern):
  - `coupon_db` (port 5433): coupon_policies, coupons
  - `point_db` (port 5434): point_balances, points
  - `timesale_db` (port 5435): products, time_sales, time_sale_orders
- **Each service has its own Prisma schema** in `apps/<service>/prisma/schema.prisma`

### Key Integration Points
- **Redis Module** (`libs/common/src/redis/`):
  - `executeWithLock()`: Redis Redlock distributed locking (used in coupon issuance)
  - `get/set()`: Generic caching (used for point balance with 5-min TTL)
  - Inventory management (used for timesale stock in Redis)
- **Kafka Module** (`libs/common/src/kafka/`):
  - `emit(topic, data)`: Fire-and-forget event publishing
  - Events: `coupon.issued`, `point.earned`, `order.created`
- **gRPC Communication**:
  - Proto files in `proto/*.proto` define service contracts
  - Generated TypeScript clients in `apps/*/src/generated/client/`
  - API Gateway uses gRPC clients to call services
  - Each service exposes both REST (for direct access) and gRPC servers

## Critical Implementation Patterns

### Distributed Locking (Coupon Service)
The coupon service uses Redis Redlock to prevent overselling during concurrent issuance:
```typescript
// libs/common/src/redis/redis.service.ts
await this.redis.executeWithLock(
  `coupon:policy:${policyId}`,
  async () => {
    // Critical section: check quantity and issue coupon
  },
  10000, // 10-second timeout
);
```

### Redis Caching (Point Service)
Point balance queries are cached for 5 minutes to reduce DB load:
```typescript
const cached = await this.redis.get(`point:balance:${userId}`);
if (cached) return parseInt(cached, 10);

// If cache miss, fetch from DB and cache
await this.redis.set(`point:balance:${userId}`, balance.toString(), 'EX', 300);
```

### Redis Inventory Management (TimeSale Service)
Time sale inventory is managed in Redis for high-performance stock control:
```typescript
// Store inventory in Redis when time sale starts
await this.redis.set(`timesale:inventory:${id}`, quantity.toString());

// Atomic decrement during order creation
const remaining = await this.redis.decr(`timesale:inventory:${id}`);
if (remaining < 0) {
  await this.redis.incr(`timesale:inventory:${id}`); // rollback
  throw new Error('Insufficient stock');
}
```

### Circuit Breaker (API Gateway)
All gRPC calls from API Gateway are protected by Opossum circuit breakers:
```typescript
// apps/api-gateway/src/common/circuit-breaker.ts
const breaker = new CircuitBreaker(asyncFunction, {
  timeout: 3000,
  errorThresholdPercentage: 50,
  resetTimeout: 30000,
});
```

### JWT Authentication
API Gateway implements JWT-based authentication:
- `/api/v1/auth/register` - User registration
- `/api/v1/auth/login` - Returns access_token and refresh_token
- Protected routes require `Authorization: Bearer <token>` header
- Use `@UseGuards(JwtAuthGuard)` on protected endpoints

## Prisma Workflow

When modifying database schemas:
1. Edit the Prisma schema: `apps/<service>/prisma/schema.prisma`
2. Create migration: `cd apps/<service> && pnpm prisma migrate dev --name <description>`
3. Generate client: `pnpm prisma generate`
4. The generated client is available at `@prisma/client` (aliased per service)

**Important**: Each service imports its own Prisma client. Never share Prisma clients across services.

## Performance Optimization Guidelines

### Redis Usage
- **Coupon Service**: Always use distributed locking (`executeWithLock`) for quantity-sensitive operations
- **Point Service**: Cache balance queries with 5-minute TTL; invalidate cache on balance changes
- **TimeSale Service**: Store inventory in Redis (key: `timesale:inventory:{id}`); sync to DB periodically

### Database Queries
- Use Prisma's `select` to fetch only required fields
- Implement pagination for list endpoints (use `skip` and `take`)
- Use database indexes for frequently queried fields (defined in Prisma schema)

### gRPC Best Practices
- Keep message sizes small (avoid large nested objects)
- Use streaming for bulk operations if needed
- Circuit breakers will trip after 50% error rate; ensure proper error handling

## Testing Strategy

### Unit Tests
- Mock Prisma client using `jest.mock()`
- Mock Redis/Kafka modules for isolation
- Test business logic without external dependencies

### E2E Tests
- Use test database (configure via `.env.test`)
- Clean database state between tests
- E2E tests are in `test/` directory with `jest-e2e.json` config

### Performance Tests
- k6 scripts are in `performance-tests/scenarios/`
- Tests validate: throughput (1,000+ req/s), response time (P95 < 200ms), data consistency

## Monitoring and Observability

### Prometheus Metrics
- All services expose metrics at `/metrics` endpoint
- API Gateway: `http://localhost:4000/metrics`
- Coupon Service: `http://localhost:3001/metrics`
- Point Service: `http://localhost:3002/metrics`
- TimeSale Service: `http://localhost:3003/metrics`

### Grafana Dashboard
- Access: `http://localhost:3000` (admin/admin)
- Pre-configured dashboard auto-loads from `monitoring/dashboards/`
- Tracks: request rate, response time, CPU/memory, error rate

### Logging
- Winston logger configured in `libs/common/src/logger/`
- Logs are written to `logs/` directory with daily rotation
- Log levels: error, warn, info, debug
- Logs include context (service name, trace ID)

## Swagger API Documentation

- Access Swagger UI: `http://localhost:4000/api/docs`
- All API Gateway endpoints are auto-documented
- Use "Authorize" button to test JWT-protected endpoints
- Try out requests directly from Swagger UI

## Common Development Tasks

### Adding a New Endpoint
1. Define proto message and RPC in `proto/<service>.proto`
2. Regenerate gRPC code: `cd apps/<service> && pnpm exec grpc_tools_node_protoc ...`
3. Implement gRPC handler in service controller
4. Add REST endpoint in API Gateway controller
5. Update Swagger annotations (`@ApiOperation`, `@ApiResponse`)

### Adding a New Service
1. Create new app: `nest g app <service-name>`
2. Set up Prisma: create `prisma/schema.prisma`, run migrations
3. Create proto file: `proto/<service>.proto`
4. Implement gRPC server in service
5. Register service in etcd
6. Add gRPC client proxy in API Gateway

### Modifying Database Schema
1. Update Prisma schema
2. Create migration: `pnpm prisma migrate dev`
3. If breaking change, plan data migration script
4. Update DTOs and validation in controller

## Code Conventions

- **File naming**: kebab-case (e.g., `coupon-policy.service.ts`)
- **Class naming**: PascalCase (e.g., `CouponPolicyService`)
- **Functions/variables**: camelCase (e.g., `issueCoupon`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_RETRY_COUNT`)
- **Avoid `any`**: Use `unknown` or proper types (TypeScript strict mode enabled)
- **Dependency Injection**: Use constructor injection exclusively
- **DTO Validation**: Use `class-validator` decorators on all DTOs
- **Error Handling**: Throw NestJS HTTP exceptions (`BadRequestException`, etc.)

## Docker Infrastructure

```bash
# Start all infrastructure services
docker-compose up -d

# View logs
docker-compose logs -f <service-name>

# Stop services
docker-compose down

# Reset all data (including volumes)
docker-compose down -v
```

Infrastructure services:
- PostgreSQL (3 instances): ports 5433, 5434, 5435
- Redis: port 6379
- Kafka + Zookeeper: port 9092
- etcd: port 2379
- Prometheus: port 9090
- Grafana: port 3000

## Important URLs

- API Gateway: http://localhost:4000
- Swagger UI: http://localhost:4000/api/docs
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3000 (admin/admin)

## Troubleshooting

### "Prisma Client Not Generated"
```bash
cd apps/<service> && pnpm prisma generate
```

### "Port Already in Use"
```bash
# Check what's using the port
netstat -ano | findstr :<port>  # Windows
lsof -i :<port>                 # macOS/Linux
```

### "Cannot Connect to PostgreSQL"
```bash
# Verify containers are running
docker-compose ps

# Restart specific database
docker-compose restart postgres-<service>
```

### "Redis Connection Failed"
```bash
# Check Redis is running
docker-compose ps redis

# Test Redis connection
docker exec -it redis redis-cli ping
```

### Clear Redis Data
```bash
docker exec -it redis redis-cli FLUSHALL
```

## Performance Targets

- **Throughput**: 1,000+ requests/second (validated via k6)
- **Response Time**: P95 < 200ms
- **Availability**: Circuit breakers prevent cascading failures
- **Data Consistency**: Distributed locks guarantee no overselling
