# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A high-performance promotion system built with microservices architecture, designed to handle 5,000+ TPS. The system consists of three independent services (Coupon, Point, TimeSale) plus an API Gateway, utilizing Redis, Kafka, and MySQL for high-throughput, low-latency operations.

## Build & Development Commands

### Installation & Setup
```bash
# Install dependencies (auto-runs postinstall scripts)
npm install  # or pnpm install

# Postinstall automatically:
# - Generates all Prisma clients (prisma:generate:all)
# - Copies .env.example to .env
```

### Infrastructure
```bash
# Start all infrastructure (MySQL x3, Redis, Kafka, Zookeeper, etcd)
docker-compose up -d

# Stop infrastructure
docker-compose down
```

### Database Migrations
```bash
# Run migrations for all services
npm run prisma:migrate:all

# Generate Prisma clients for all services
npm run prisma:generate:all

# Individual service migrations
cd apps/coupon-service && prisma migrate dev
cd apps/point-service && prisma migrate dev
cd apps/timesale-service && prisma migrate dev
```

### Running Services
```bash
# Run all services simultaneously (recommended for development)
npm run start:all

# Run individual services
npm run start:gateway           # API Gateway only (port 4000)
npm run start:dev coupon-service    # Coupon (port 3001)
npm run start:dev point-service     # Point (port 3002)
npm run start:dev timesale-service  # TimeSale (port 3003)

# Production mode
npm run start:prod
```

### Testing
```bash
# Run all tests
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run test:cov

# E2E tests
npm run test:e2e
```

### Building
```bash
# Build all services
npm run build

# Build specific service
nest build coupon-service
nest build point-service
nest build timesale-service
nest build api-gateway
```

## Architecture

### Microservices Structure

**NestJS Monorepo** with 4 applications and 1 shared library:

```
apps/
├── api-gateway/           # HTTP Gateway (port 4000)
│   ├── src/gateway/      # gRPC client proxies
│   ├── src/middleware/   # Rate limiting
│   └── src/health/       # Health checks
├── coupon-service/       # HTTP 3001, gRPC 5001
│   ├── src/coupon/       # V1/V2/V3 strategies
│   ├── prisma/           # Coupon DB schema
│   └── Dockerfile
├── point-service/        # HTTP 3002, gRPC 5002
│   ├── src/point/        # Redis caching, Optimistic locking
│   ├── prisma/           # Point DB schema
│   └── Dockerfile
└── timesale-service/     # HTTP 3003, gRPC 5003
    ├── src/timesale/     # V1/V2/V3 order processing
    ├── prisma/           # TimeSale DB schema
    └── Dockerfile

libs/
└── common/
    ├── kafka/            # Kafka producer/consumer
    └── redis/            # Redis client wrapper

proto/                    # gRPC service definitions
├── coupon.proto
├── point.proto
└── timesale.proto
```

### Communication Patterns

1. **HTTP REST API**: Client → API Gateway → Services (primary)
2. **gRPC**: API Gateway ↔ Services (service-to-service)
3. **Kafka**: Async processing for V3 strategies
4. **Redis**: Distributed locks, caching, atomic operations

### Database Architecture

- **3 Independent MySQL Databases** (ports 3307, 3308, 3309)
  - `coupon_db`: Coupon policies and issuances
  - `point_db`: User points and transactions
  - `timesale_db`: TimeSale products and orders
- **Prisma ORM**: Each service has its own schema and migrations
- **Database Per Service**: True microservices isolation

## Performance Strategies (V1/V2/V3)

All services implement three strategies with progressively better performance:

### V1: Database-Based (Baseline)
- Prisma transactions for consistency
- Basic concurrency control
- ~100 TPS
- Query param: `?strategy=v1`

### V2: Redis-Optimized
- Distributed locks (Redis SET NX)
- Cache-aside pattern
- Atomic operations (INCR/DECR)
- ~500 TPS
- Query param: `?strategy=v2`

### V3: Kafka Async (Recommended for high traffic)
- Immediate response (PENDING/QUEUED status)
- Producer/Consumer pattern
- Sequential processing via Kafka topics
- ~5,000+ TPS
- Query param: `?strategy=v3`

**When to use which strategy:**
- V1: Testing, development, audit requirements
- V2: Moderate traffic, need immediate confirmation
- V3: High traffic events (flash sales, promotions)

## Key Technical Details

### gRPC Implementation

Services expose both HTTP REST and gRPC endpoints:
- HTTP: For external clients via API Gateway
- gRPC: For inter-service communication
- Proto files in `/proto` directory
- gRPC ports: 5001 (coupon), 5002 (point), 5003 (timesale)

**Important**: When adding new gRPC methods:
1. Update `.proto` files
2. Restart services (gRPC definitions are loaded at startup)
3. Gateway automatically proxies to gRPC endpoints

### Kafka Topics

**Coupon Service:**
- `coupon-issue-requests`: Issue requests
- `coupon-issue-success`: Success notifications
- `coupon-issue-failures`: Failure notifications

**TimeSale Service:**
- `timesale-order-requests`: Order requests
- `timesale-order-success`: Success notifications
- `timesale-order-failures`: Failure notifications

**Consumer Groups:**
- `coupon-service-group`
- `timesale-service-group`

### Redis Usage Patterns

1. **Distributed Locks**: `SET stock:lock:{id} NX EX 10`
2. **Caching**: Cache-aside with TTL (Point Service)
3. **Atomic Operations**: `DECR stock:{id}` (TimeSale V2)
4. **Rate Limiting**: Token bucket in API Gateway

### Prisma Schema Locations

- Coupon: `apps/coupon-service/prisma/schema.prisma`
- Point: `apps/point-service/prisma/schema.prisma`
- TimeSale: `apps/timesale-service/prisma/schema.prisma`

**When modifying schemas:**
1. Edit the schema file
2. Run `prisma migrate dev` in service directory
3. Run `prisma generate` to update client
4. Restart the service

## API Gateway Details

- **Port**: 4000
- **Routing**: Path-based (`/api/coupons/*`, `/api/points/*`, `/api/timesales/*`)
- **Rate Limiting**: 100 req/min per IP (configurable via env)
- **Health Check**: `/api/health` (includes all services status)

**Environment Variables:**
- `GATEWAY_PORT`: Gateway port (default: 4000)
- `COUPON_SERVICE_URL`: Coupon service URL
- `POINT_SERVICE_URL`: Point service URL
- `TIMESALE_SERVICE_URL`: TimeSale service URL
- `RATE_LIMIT_MAX`: Max requests per window
- `RATE_LIMIT_WINDOW`: Time window in seconds

## Common Development Workflows

### Adding a New Feature to a Service

1. **Update database schema** (if needed)
   ```bash
   cd apps/{service-name}
   # Edit prisma/schema.prisma
   prisma migrate dev --name feature_name
   ```

2. **Create DTOs** in `src/{service}/dto/`

3. **Update service logic** in `src/{service}/{service}.service.ts`

4. **Add controller endpoints** in `src/{service}/{service}.controller.ts`

5. **Update gRPC** (if needed):
   - Edit `proto/{service}.proto`
   - Add gRPC controller method in `{service}.grpc.controller.ts`

6. **Update Swagger docs** with decorators (@ApiOperation, @ApiResponse)

### Debugging Performance Issues

1. **Check strategy in use**: V1/V2/V3 have vastly different performance
2. **Monitor Redis**: `docker exec -it redis redis-cli MONITOR`
3. **Check Kafka lag**:
   ```bash
   docker exec -it kafka kafka-consumer-groups \
     --bootstrap-server localhost:9092 --describe --group {group-name}
   ```
4. **Database queries**: Enable Prisma logging in service

### Testing Concurrent Requests

Use PowerShell for Windows or bash for Unix:
```powershell
# PowerShell: 1000 concurrent coupon requests
1..1000 | ForEach-Object -Parallel {
    $userId = $_
    curl -X POST "http://localhost:4000/api/coupons/issue?strategy=v3" `
      -H "Content-Type: application/json" `
      -d "{\"policyId\":\"1\",\"userId\":\"$userId\"}"
} -ThrottleLimit 100
```

## Important Conventions

1. **Strategy Parameter**: Always passed as query param `?strategy=v1|v2|v3`
2. **Validation**: Global ValidationPipe enabled (whitelist + transform)
3. **Global Prefix**: All APIs use `/api` prefix
4. **CORS**: Enabled in API Gateway, disabled in services
5. **Error Handling**: Services throw HTTP exceptions, Gateway propagates them

## Environment Files

- `.env.example`: Template (committed)
- `.env`: Local config (gitignored, auto-created on install)

**Key variables:**
- Database URLs (3 separate MySQL connections)
- Redis connection (host/port)
- Kafka brokers
- Service ports (HTTP and gRPC)
- etcd endpoint (for future service discovery)

## Production Deployment

```bash
# Build Docker images
docker-compose -f docker-compose.prod.yml build

# Deploy
docker-compose -f docker-compose.prod.yml up -d
```

**Note**: Production compose includes all services + infrastructure. Development typically runs services locally with `npm run start:all`.

## Troubleshooting

### "Cannot find module '@prisma/client'"
Run `npm run prisma:generate:all`

### "Port already in use"
Check if services are already running: `lsof -i :3001` (or ports 3002, 3003, 4000)

### "Connection refused" errors
Ensure infrastructure is running: `docker-compose ps`

### Kafka consumer not processing
1. Check topic exists: `docker exec -it kafka kafka-topics --list --bootstrap-server localhost:9092`
2. Verify consumer group: Check service logs for consumer group ID
3. Check for errors in service logs

### gRPC errors in Gateway
1. Ensure services expose gRPC on ports 5001, 5002, 5003
2. Check proto files are in sync
3. Restart all services after proto changes

---

## NestJS Best Practices

This project follows NestJS best practices for enterprise-grade microservices. The following patterns and conventions must be followed when making changes.

### Module Organization

**Pattern: Feature-Based Modules**

Each service follows a clean module hierarchy:
```
app.module.ts (root)
├── ConfigModule (global)
├── RedisModule (global, from @app/common)
├── KafkaModule (global, from @app/common)
└── Feature Modules (Coupon, Point, TimeSale)
```

**Rules:**
1. Use `@Global()` decorator for shared infrastructure modules (Redis, Kafka, Config)
2. Keep feature modules isolated (Coupon, Point, TimeSale)
3. Import shared modules via `@app/common` library
4. Never create circular dependencies between modules

**Example:**
```typescript
// libs/common/src/redis/redis.module.ts
@Global()
@Module({
    providers: [RedisService],
    exports: [RedisService],
})
export class RedisModule {}

// apps/coupon-service/src/app.module.ts
@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        RedisModule,  // Available globally, no re-import needed
        CouponModule, // Feature module
    ],
})
export class AppModule {}
```

### Dependency Injection

**Pattern: Constructor Injection with Proper Types**

**Rules:**
1. Always use constructor injection (never property injection)
2. Mark services with `@Injectable()` decorator
3. Use `@Inject()` for named providers (gRPC clients, custom tokens)
4. Keep constructors clean - no logic, only dependency declaration

**Example:**
```typescript
@Injectable()
export class CouponService {
    private readonly logger = new Logger(CouponService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly redis: RedisService,
        private readonly kafka: KafkaService,
    ) {}
}

// For named providers (like gRPC clients)
constructor(
    @Inject('COUPON_SERVICE') private couponClient: ClientGrpc,
) {}
```

### Exception Handling

**Pattern: Global Exception Filter + HTTP Exceptions**

**Rules:**
1. Use built-in HTTP exceptions (`BadRequestException`, `NotFoundException`, etc.)
2. Global exception filter handles all errors and formats responses consistently
3. Include context in error messages (Korean for user-facing, English for logs)
4. Log errors with appropriate level (error for 5xx, warn for 4xx)

**Global filter is located at:** `libs/common/src/filters/http-exception.filter.ts`

**Example:**
```typescript
// In service methods - throw HTTP exceptions
if (!policy) {
    throw new NotFoundException('쿠폰 정책을 찾을 수 없습니다');
}

if (currentCount >= policy.totalQuantity) {
    throw new BadRequestException('쿠폰이 모두 소진되었습니다');
}

// In main.ts - apply global filter
import { HttpExceptionFilter } from '@app/common';

app.useGlobalFilters(new HttpExceptionFilter());
```

**Error response format (automatic):**
```json
{
    "statusCode": 404,
    "timestamp": "2026-01-20T...",
    "path": "/api/coupons/999",
    "method": "GET",
    "message": "쿠폰 정책을 찾을 수 없습니다"
}
```

### Logging

**Pattern: NestJS Logger with Context**

**Rules:**
1. **NEVER use console.log/error/warn** - always use Logger
2. Create logger instance with service name as context
3. Use appropriate log levels: `log()`, `warn()`, `error()`, `debug()`
4. Include stack traces for errors: `error(message, error.stack)`
5. Use structured logging for important events

**Example:**
```typescript
@Injectable()
export class CouponService {
    private readonly logger = new Logger(CouponService.name);

    async issueCoupon(dto: IssueCouponDto) {
        this.logger.log(`Issuing coupon: policyId=${dto.policyId}, userId=${dto.userId}`);

        try {
            // ... logic
            this.logger.log('Coupon issued successfully');
            return result;
        } catch (error) {
            this.logger.error('Failed to issue coupon', error.stack);
            throw error;
        }
    }
}
```

**Custom Decorator for Execution Logging:**
```typescript
import { LogExecution } from '@app/common';

@LogExecution()  // Automatically logs method execution time
async processCouponIssue(message: any) {
    // ... logic
}
```

### Interceptors

**Pattern: Logging and Transform Interceptors**

**Available Interceptors (in @app/common):**
1. `LoggingInterceptor` - Request/response logging with timing
2. `TransformInterceptor` - Standardizes response format

**Rules:**
1. Apply logging interceptor globally for all HTTP requests
2. Use transform interceptor if consistent response format is needed
3. Interceptors run before/after request handlers

**Example:**
```typescript
// In main.ts
import { LoggingInterceptor } from '@app/common';

app.useGlobalInterceptors(new LoggingInterceptor());

// Optional: Transform responses to standard format
import { TransformInterceptor } from '@app/common';
app.useGlobalInterceptors(new TransformInterceptor());
```

### Validation

**Pattern: class-validator with Global ValidationPipe**

**Rules:**
1. All DTOs must use class-validator decorators
2. Global ValidationPipe configured with `whitelist: true` and `transform: true`
3. Use specific validators (`@IsEnum`, `@Min`, `@Max`, `@IsDateString`)
4. Group related validations in DTO classes

**Example:**
```typescript
// DTO with validation
export class CreateCouponPolicyDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsInt()
    @Min(1)
    totalQuantity: number;

    @IsDateString()
    startTime: string;

    @IsEnum(DiscountType)
    discountType: DiscountType;

    @IsInt()
    @Min(0)
    @Max(100)
    discountValue: number;
}

// In main.ts - global validation pipe
app.useGlobalPipes(
    new ValidationPipe({
        whitelist: true,      // Strip unknown properties
        transform: true,      // Auto-transform to DTO type
        forbidNonWhitelisted: true,  // Throw error on unknown props
    }),
);
```

### Configuration Management

**Pattern: Global ConfigModule per Service**

**Rules:**
1. Each service has its own `.env` file in `apps/{service-name}/.env`
2. ConfigModule configured as global in AppModule
3. Access config via `process.env.VARIABLE_NAME`
4. Always provide fallback defaults for non-sensitive values

**Example:**
```typescript
// In app.module.ts
ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: 'apps/coupon-service/.env',
})

// In service code
const port = process.env.PORT || 3001;
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
```

### Lifecycle Hooks

**Pattern: OnModuleInit & OnModuleDestroy**

**Rules:**
1. Use `OnModuleInit` for async initialization (DB connections, Kafka consumers)
2. Use `OnModuleDestroy` for cleanup (close connections)
3. Implement interfaces explicitly
4. Keep initialization logic in lifecycle hooks, not constructors

**Example:**
```typescript
@Injectable()
export class CouponService implements OnModuleInit, OnModuleDestroy {
    async onModuleInit() {
        // Start Kafka consumer
        await this.kafka.subscribe(
            'coupon-issue-requests',
            'coupon-service-group',
            this.handleMessage.bind(this),
        );
        this.logger.log('Kafka consumer initialized');
    }

    async onModuleDestroy() {
        // Cleanup resources
        await this.kafka.disconnect();
        this.logger.log('Service shutting down');
    }
}
```

### Microservices Communication

**Pattern: Dual HTTP + gRPC Endpoints**

**Rules:**
1. All services expose **both** HTTP REST and gRPC endpoints
2. HTTP for external clients (via API Gateway)
3. gRPC for service-to-service communication
4. Proto files in `/proto` directory are source of truth

**Service Configuration:**
```typescript
// In main.ts - expose both HTTP and gRPC
const app = await NestFactory.create(AppModule);

// HTTP REST API
app.setGlobalPrefix('api');
await app.listen(3001);

// gRPC Microservice
app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
        package: 'coupon',
        protoPath: join(__dirname, '../../../proto/coupon.proto'),
        url: '0.0.0.0:5001',
    },
});

await app.startAllMicroservices();
```

**gRPC Controller:**
```typescript
@Controller()
export class CouponGrpcController {
    @GrpcMethod('CouponService', 'IssueCoupon')
    async issueCoupon(data: IssueCouponRequest) {
        // Convert gRPC request to DTO
        const dto = { policyId: data.policyId, userId: data.userId };
        const result = await this.couponService.issueCoupon(dto);
        // Convert result to gRPC response
        return result;
    }
}
```

### Swagger Documentation

**Pattern: @nestjs/swagger Decorators**

**Rules:**
1. All controllers must have Swagger decorators
2. Use `@ApiOperation()` to describe endpoints
3. Use `@ApiResponse()` for response documentation
4. Use `@ApiTags()` to group endpoints

**Example:**
```typescript
@ApiTags('coupons')
@Controller('coupons')
export class CouponController {
    @Post('issue')
    @ApiOperation({
        summary: '쿠폰 발급',
        description: 'V1/V2/V3 전략으로 쿠폰을 발급합니다'
    })
    @ApiResponse({
        status: 200,
        description: '쿠폰 발급 성공',
        type: IssueCouponResponseDto,
    })
    @ApiResponse({
        status: 400,
        description: '재고 부족 또는 유효하지 않은 요청'
    })
    async issueCoupon(
        @Body() dto: IssueCouponDto,
        @Query('strategy') strategy: string = 'v1',
    ) {
        return this.couponService.issueCoupon(dto, strategy);
    }
}
```

### Testing Patterns

**Pattern: Unit Tests with Mocks**

**Rules:**
1. Test files must be named `*.spec.ts`
2. Mock all external dependencies (Prisma, Redis, Kafka)
3. Test business logic, not framework features
4. Use `@nestjs/testing` for creating test modules

**Example:**
```typescript
describe('CouponService', () => {
    let service: CouponService;
    let prisma: PrismaService;
    let redis: RedisService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                CouponService,
                {
                    provide: PrismaService,
                    useValue: { /* mock */ },
                },
                {
                    provide: RedisService,
                    useValue: { /* mock */ },
                },
            ],
        }).compile();

        service = module.get<CouponService>(CouponService);
    });

    it('should issue coupon successfully', async () => {
        // Test implementation
    });
});
```

### Common Anti-Patterns to Avoid

**❌ DON'T:**
1. Use `console.log()` - use `Logger` instead
2. Put business logic in controllers - keep them thin
3. Create circular dependencies between modules
4. Access `process.env` directly in services - use ConfigService
5. Skip error handling in async operations
6. Use `any` type excessively - leverage TypeScript types
7. Create global state - use dependency injection
8. Ignore validation - always validate inputs
9. Mix HTTP and business logic in same method
10. Skip Swagger documentation

**✅ DO:**
1. Use NestJS Logger with context
2. Keep controllers thin (routing + validation only)
3. Extract business logic to services
4. Use dependency injection for all dependencies
5. Implement proper error handling with HTTP exceptions
6. Use DTOs with class-validator
7. Document APIs with Swagger decorators
8. Apply global filters, pipes, and interceptors in `main.ts`
9. Implement lifecycle hooks for initialization
10. Follow feature-based module structure

### File Naming Conventions

```
{name}.controller.ts      # HTTP REST controllers
{name}.grpc.controller.ts # gRPC controllers
{name}.service.ts         # Business logic services
{name}.module.ts          # NestJS modules
{name}.dto.ts             # Data Transfer Objects
{name}.entity.ts          # Database entities (Prisma)
{name}.spec.ts            # Unit tests
{name}.e2e-spec.ts        # E2E tests
```

### Quick Checklist for New Features

When adding new features, ensure:

- [ ] DTOs created with validation decorators
- [ ] Service uses Logger (not console.log)
- [ ] HTTP exceptions used for error handling
- [ ] Swagger decorators added to controller
- [ ] Global exception filter applied
- [ ] Proper dependency injection (constructor)
- [ ] Business logic in service, not controller
- [ ] Lifecycle hooks for async initialization
- [ ] Unit tests written with mocks
- [ ] Proto file updated if adding gRPC methods

---

## Additional Resources

- [NestJS Official Documentation](https://docs.nestjs.com)
- [NestJS Best Practices](https://docs.nestjs.com/fundamentals/testing)
- [class-validator Documentation](https://github.com/typestack/class-validator)
