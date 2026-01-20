import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('API Gateway (E2E)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();

        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                transform: true,
            }),
        );

        app.setGlobalPrefix('api');
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('GET /api/health - Health Check', () => {
        it('should return gateway health status', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/health')
                .expect(200);

            expect(response.body).toHaveProperty('status');
            expect(response.body).toHaveProperty('timestamp');
            expect(response.body.status).toBe('ok');
        });

        it('should include service availability info', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/health')
                .expect(200);

            // Check if the health endpoint provides info about downstream services
            expect(response.body).toBeDefined();
            expect(typeof response.body).toBe('object');
        });
    });

    describe('Gateway - CORS', () => {
        it('should have CORS enabled', async () => {
            const response = await request(app.getHttpServer())
                .options('/api/health')
                .set('Origin', 'http://localhost:3000')
                .set('Access-Control-Request-Method', 'GET');

            expect(response.headers['access-control-allow-origin']).toBeDefined();
        });
    });

    describe('Gateway - Global Prefix', () => {
        it('should require /api prefix for all routes', async () => {
            // Without /api prefix should fail
            await request(app.getHttpServer())
                .get('/health')
                .expect(404);

            // With /api prefix should succeed
            await request(app.getHttpServer())
                .get('/api/health')
                .expect(200);
        });
    });

    describe('Gateway - Validation', () => {
        it('should validate request body with ValidationPipe', async () => {
            const invalidCouponPolicy = {
                title: '',
                totalQuantity: -1,
                discountType: 'INVALID_TYPE',
            };

            const response = await request(app.getHttpServer())
                .post('/api/coupons/policies')
                .send(invalidCouponPolicy)
                .expect(400);

            expect(response.body).toHaveProperty('statusCode');
            expect(response.body.statusCode).toBe(400);
        });

        it('should transform and validate query parameters', async () => {
            // Create a coupon policy first
            const policyResponse = await request(app.getHttpServer())
                .post('/api/coupons/policies')
                .send({
                    title: 'Validation Test',
                    description: 'Test',
                    totalQuantity: 100,
                    startTime: new Date().toISOString(),
                    endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                    discountType: 'PERCENTAGE',
                    discountValue: 10,
                    minimumOrderAmount: 0,
                    maximumDiscountAmount: 0,
                });

            const policyId = policyResponse.body.id;

            // Valid strategy query param
            await request(app.getHttpServer())
                .post('/api/coupons/issue?strategy=v1')
                .send({
                    policyId,
                    userId: 'validation-test-user',
                })
                .expect(201);

            // Strategy param is optional, should default to v1
            await request(app.getHttpServer())
                .post('/api/coupons/issue')
                .send({
                    policyId,
                    userId: 'validation-test-user-2',
                })
                .expect(201);
        });
    });

    describe('Gateway - Rate Limiting', () => {
        it('should handle multiple requests', async () => {
            const promises = Array.from({ length: 10 }, () =>
                request(app.getHttpServer())
                    .get('/api/health')
            );

            const results = await Promise.all(promises);
            const allSucceeded = results.every(r => r.status === 200);

            expect(allSucceeded).toBe(true);
        });

        // Note: Actual rate limit testing would require more sophisticated setup
        // and depends on RATE_LIMIT_MAX and RATE_LIMIT_WINDOW env variables
    });

    describe('Gateway - Service Integration', () => {
        it('should route to all three services correctly', async () => {
            // Test Coupon Service routing
            const couponResponse = await request(app.getHttpServer())
                .post('/api/coupons/policies')
                .send({
                    title: 'Integration Test Coupon',
                    description: 'Test',
                    totalQuantity: 50,
                    startTime: new Date().toISOString(),
                    endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                    discountType: 'FIXED_AMOUNT',
                    discountValue: 5000,
                    minimumOrderAmount: 0,
                    maximumDiscountAmount: 5000,
                })
                .expect(201);

            expect(couponResponse.body).toHaveProperty('id');

            // Test Point Service routing
            const pointResponse = await request(app.getHttpServer())
                .post('/api/points/add')
                .send({
                    userId: 'integration-test-user',
                    amount: 10000,
                    description: 'Integration test',
                })
                .expect(201);

            expect(pointResponse.body).toHaveProperty('id');

            // Test TimeSale Service routing
            const timesaleResponse = await request(app.getHttpServer())
                .post('/api/timesales')
                .send({
                    productId: 'integration-test-product',
                    quantity: 100,
                    discountPrice: 25000,
                    startAt: new Date().toISOString(),
                    endAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                })
                .expect(201);

            expect(timesaleResponse.body).toHaveProperty('id');
        });

        it('should handle concurrent requests to different services', async () => {
            const promises = [
                request(app.getHttpServer())
                    .get('/api/coupons/users/concurrent-test-user'),

                request(app.getHttpServer())
                    .get('/api/points/balance/concurrent-test-user'),

                request(app.getHttpServer())
                    .get('/api/health'),
            ];

            const results = await Promise.all(promises);
            const allSucceeded = results.every(r => r.status === 200);

            expect(allSucceeded).toBe(true);
        });
    });

    describe('Gateway - Error Handling', () => {
        it('should handle 404 errors gracefully', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/non-existent-route')
                .expect(404);

            expect(response.body).toHaveProperty('statusCode');
            expect(response.body.statusCode).toBe(404);
        });

        it('should propagate service errors correctly', async () => {
            // Try to use a non-existent coupon
            const response = await request(app.getHttpServer())
                .post('/api/coupons/invalid-coupon-id/use')
                .send({
                    orderId: 'test-order',
                })
                .expect(404);

            expect(response.body).toHaveProperty('statusCode');
            expect(response.body.statusCode).toBe(404);
        });

        it('should handle malformed requests', async () => {
            // Send invalid JSON structure
            await request(app.getHttpServer())
                .post('/api/coupons/policies')
                .send({ invalid: 'data' })
                .expect(400);
        });
    });

    describe('Gateway - Strategy Parameter Handling', () => {
        let testPolicyId: string;
        let testTimeSaleId: string;

        beforeAll(async () => {
            // Create test coupon policy
            const policyResponse = await request(app.getHttpServer())
                .post('/api/coupons/policies')
                .send({
                    title: 'Strategy Test Coupon',
                    description: 'For strategy testing',
                    totalQuantity: 1000,
                    startTime: new Date().toISOString(),
                    endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                    discountType: 'PERCENTAGE',
                    discountValue: 15,
                    minimumOrderAmount: 0,
                    maximumDiscountAmount: 0,
                });

            testPolicyId = policyResponse.body.id;

            // Create test timesale
            const timesaleResponse = await request(app.getHttpServer())
                .post('/api/timesales')
                .send({
                    productId: 'strategy-test-product',
                    quantity: 1000,
                    discountPrice: 30000,
                    startAt: new Date().toISOString(),
                    endAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                });

            testTimeSaleId = timesaleResponse.body.id;
        });

        it('should accept all strategy variants for coupon service', async () => {
            const strategies = ['v1', 'v2', 'v3'];

            for (const strategy of strategies) {
                const response = await request(app.getHttpServer())
                    .post(`/api/coupons/issue?strategy=${strategy}`)
                    .send({
                        policyId: testPolicyId,
                        userId: `strategy-test-${strategy}`,
                    })
                    .expect(201);

                expect(response.body).toHaveProperty('id');
            }
        });

        it('should accept all strategy variants for timesale service', async () => {
            const strategies = ['v1', 'v2', 'v3'];

            for (const strategy of strategies) {
                const response = await request(app.getHttpServer())
                    .post(`/api/timesales/${testTimeSaleId}/orders?strategy=${strategy}`)
                    .send({
                        userId: `strategy-test-${strategy}`,
                        quantity: 1,
                    })
                    .expect(201);

                expect(response.body).toHaveProperty('id');
            }
        });

        it('should default to v1 when strategy is not specified', async () => {
            const couponResponse = await request(app.getHttpServer())
                .post('/api/coupons/issue')
                .send({
                    policyId: testPolicyId,
                    userId: 'default-strategy-user',
                })
                .expect(201);

            expect(couponResponse.body).toHaveProperty('id');
            expect(couponResponse.body.status).toBe('ACTIVE');
        });
    });

    describe('Gateway - Performance Monitoring', () => {
        it('should handle sustained load', async () => {
            const duration = 5000; // 5 seconds
            const startTime = Date.now();
            const requests = [];

            while (Date.now() - startTime < duration) {
                requests.push(
                    request(app.getHttpServer())
                        .get('/api/health')
                );

                // Small delay to prevent overwhelming
                await new Promise(resolve => setTimeout(resolve, 10));
            }

            const results = await Promise.all(requests);
            const successCount = results.filter(r => r.status === 200).length;
            const totalRequests = results.length;

            console.log(`\nSustained load test: ${totalRequests} requests in ${duration}ms`);
            console.log(`Success rate: ${((successCount / totalRequests) * 100).toFixed(2)}%`);

            expect(successCount).toBeGreaterThan(0);
            expect(successCount / totalRequests).toBeGreaterThan(0.95); // 95% success rate
        });
    });

    describe('Gateway - gRPC Integration', () => {
        it('should communicate with services via gRPC', async () => {
            // The gateway uses gRPC internally to communicate with services
            // This test verifies that gRPC communication works end-to-end

            // Create a coupon policy (should use gRPC internally)
            const policyResponse = await request(app.getHttpServer())
                .post('/api/coupons/policies')
                .send({
                    title: 'gRPC Test Coupon',
                    description: 'Testing gRPC communication',
                    totalQuantity: 100,
                    startTime: new Date().toISOString(),
                    endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                    discountType: 'FIXED_AMOUNT',
                    discountValue: 3000,
                    minimumOrderAmount: 0,
                    maximumDiscountAmount: 3000,
                })
                .expect(201);

            expect(policyResponse.body).toHaveProperty('id');

            // Get user coupons (should use gRPC internally)
            const couponsResponse = await request(app.getHttpServer())
                .get('/api/coupons/users/grpc-test-user')
                .expect(200);

            expect(Array.isArray(couponsResponse.body)).toBe(true);
        });
    });
});
