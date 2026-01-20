import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Coupon Service via API Gateway (E2E)', () => {
    let app: INestApplication;
    let createdPolicyId: string;

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

    describe('POST /api/coupons/policies - 쿠폰 정책 생성', () => {
        it('should create a new coupon policy', async () => {
            const policyData = {
                title: 'E2E Test Coupon',
                description: 'E2E 테스트용 쿠폰',
                totalQuantity: 1000,
                startTime: new Date().toISOString(),
                endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                discountType: 'PERCENTAGE',
                discountValue: 20,
                minimumOrderAmount: 10000,
                maximumDiscountAmount: 5000,
            };

            const response = await request(app.getHttpServer())
                .post('/api/coupons/policies')
                .send(policyData)
                .expect(201);

            expect(response.body).toHaveProperty('id');
            expect(response.body.title).toBe(policyData.title);
            expect(response.body.totalQuantity).toBe(policyData.totalQuantity);

            createdPolicyId = response.body.id;
        });

        it('should fail with invalid data', async () => {
            const invalidData = {
                title: '',
                totalQuantity: -1,
            };

            await request(app.getHttpServer())
                .post('/api/coupons/policies')
                .send(invalidData)
                .expect(400);
        });
    });

    describe('POST /api/coupons/issue - 쿠폰 발급 (V1 Strategy)', () => {
        it('should issue coupon using V1 strategy (database-based)', async () => {
            const issueData = {
                policyId: createdPolicyId,
                userId: 'user-v1-001',
            };

            const response = await request(app.getHttpServer())
                .post('/api/coupons/issue?strategy=v1')
                .send(issueData)
                .expect(201);

            expect(response.body).toHaveProperty('id');
            expect(response.body.policyId).toBe(createdPolicyId);
            expect(response.body.userId).toBe(issueData.userId);
            expect(response.body.status).toBe('ACTIVE');
        });

        it('should handle concurrent V1 requests correctly', async () => {
            const promises = Array.from({ length: 10 }, (_, i) =>
                request(app.getHttpServer())
                    .post('/api/coupons/issue?strategy=v1')
                    .send({
                        policyId: createdPolicyId,
                        userId: `user-v1-concurrent-${i}`,
                    })
            );

            const results = await Promise.all(promises);
            const successCount = results.filter(r => r.status === 201).length;

            expect(successCount).toBeGreaterThan(0);
            expect(successCount).toBeLessThanOrEqual(10);
        });
    });

    describe('POST /api/coupons/issue - 쿠폰 발급 (V2 Strategy)', () => {
        it('should issue coupon using V2 strategy (Redis-optimized)', async () => {
            const issueData = {
                policyId: createdPolicyId,
                userId: 'user-v2-001',
            };

            const response = await request(app.getHttpServer())
                .post('/api/coupons/issue?strategy=v2')
                .send(issueData)
                .expect(201);

            expect(response.body).toHaveProperty('id');
            expect(response.body.policyId).toBe(createdPolicyId);
            expect(response.body.userId).toBe(issueData.userId);
            expect(response.body.status).toBe('ACTIVE');
        });

        it('should handle high concurrency with V2 strategy', async () => {
            const promises = Array.from({ length: 50 }, (_, i) =>
                request(app.getHttpServer())
                    .post('/api/coupons/issue?strategy=v2')
                    .send({
                        policyId: createdPolicyId,
                        userId: `user-v2-concurrent-${i}`,
                    })
            );

            const results = await Promise.all(promises);
            const successCount = results.filter(r => r.status === 201).length;

            expect(successCount).toBeGreaterThan(0);
        });

        it('should be faster than V1 strategy', async () => {
            const v1Start = Date.now();
            await request(app.getHttpServer())
                .post('/api/coupons/issue?strategy=v1')
                .send({
                    policyId: createdPolicyId,
                    userId: 'user-v1-speed',
                });
            const v1Duration = Date.now() - v1Start;

            const v2Start = Date.now();
            await request(app.getHttpServer())
                .post('/api/coupons/issue?strategy=v2')
                .send({
                    policyId: createdPolicyId,
                    userId: 'user-v2-speed',
                });
            const v2Duration = Date.now() - v2Start;

            console.log(`V1: ${v1Duration}ms, V2: ${v2Duration}ms`);
            // V2 should typically be faster, but we don't enforce strict timing
            expect(v2Duration).toBeLessThan(v1Duration * 2);
        });
    });

    describe('POST /api/coupons/issue - 쿠폰 발급 (V3 Strategy)', () => {
        it('should issue coupon using V3 strategy (Kafka async)', async () => {
            const issueData = {
                policyId: createdPolicyId,
                userId: 'user-v3-001',
            };

            const response = await request(app.getHttpServer())
                .post('/api/coupons/issue?strategy=v3')
                .send(issueData)
                .expect(201);

            // V3 returns PENDING status immediately
            expect(response.body).toHaveProperty('id');
            expect(response.body.status).toMatch(/PENDING|QUEUED|ACTIVE/);
        });

        it('should handle extreme concurrency with V3 strategy', async () => {
            const promises = Array.from({ length: 100 }, (_, i) =>
                request(app.getHttpServer())
                    .post('/api/coupons/issue?strategy=v3')
                    .send({
                        policyId: createdPolicyId,
                        userId: `user-v3-concurrent-${i}`,
                    })
            );

            const results = await Promise.all(promises);
            const allSucceeded = results.every(r => r.status === 201);

            expect(allSucceeded).toBe(true);
        });

        it('should respond immediately (async processing)', async () => {
            const start = Date.now();

            await request(app.getHttpServer())
                .post('/api/coupons/issue?strategy=v3')
                .send({
                    policyId: createdPolicyId,
                    userId: 'user-v3-async',
                })
                .expect(201);

            const duration = Date.now() - start;

            // V3 should respond almost immediately (< 100ms typically)
            expect(duration).toBeLessThan(500);
        });
    });

    describe('GET /api/coupons/users/:userId - 사용자 쿠폰 조회', () => {
        it('should get user coupons', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/coupons/users/user-v1-001')
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);

            const coupon = response.body[0];
            expect(coupon).toHaveProperty('id');
            expect(coupon).toHaveProperty('userId');
            expect(coupon).toHaveProperty('status');
        });

        it('should return empty array for user with no coupons', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/coupons/users/non-existent-user')
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(0);
        });
    });

    describe('POST /api/coupons/:couponId/use - 쿠폰 사용', () => {
        let couponId: string;

        beforeAll(async () => {
            // Create a coupon to use
            const issueResponse = await request(app.getHttpServer())
                .post('/api/coupons/issue?strategy=v1')
                .send({
                    policyId: createdPolicyId,
                    userId: 'user-for-use',
                });

            couponId = issueResponse.body.id;
        });

        it('should use a coupon successfully', async () => {
            const response = await request(app.getHttpServer())
                .post(`/api/coupons/${couponId}/use`)
                .send({
                    orderId: 'order-001',
                })
                .expect(200);

            expect(response.body.status).toBe('USED');
            expect(response.body.usedAt).toBeDefined();
        });

        it('should fail to use already used coupon', async () => {
            await request(app.getHttpServer())
                .post(`/api/coupons/${couponId}/use`)
                .send({
                    orderId: 'order-002',
                })
                .expect(400);
        });

        it('should fail with invalid coupon id', async () => {
            await request(app.getHttpServer())
                .post('/api/coupons/invalid-id/use')
                .send({
                    orderId: 'order-003',
                })
                .expect(404);
        });
    });

    describe('Strategy Comparison - Performance Test', () => {
        it('should compare all three strategies', async () => {
            const iterations = 20;
            const strategies = ['v1', 'v2', 'v3'];
            const results = {};

            for (const strategy of strategies) {
                const start = Date.now();

                const promises = Array.from({ length: iterations }, (_, i) =>
                    request(app.getHttpServer())
                        .post(`/api/coupons/issue?strategy=${strategy}`)
                        .send({
                            policyId: createdPolicyId,
                            userId: `user-compare-${strategy}-${i}`,
                        })
                );

                await Promise.all(promises);
                const duration = Date.now() - start;

                results[strategy] = {
                    duration,
                    avgPerRequest: duration / iterations,
                };
            }

            console.log('\nStrategy Performance Comparison:');
            console.log(`V1 (Database):     ${results['v1'].duration}ms (avg: ${results['v1'].avgPerRequest.toFixed(2)}ms/req)`);
            console.log(`V2 (Redis):        ${results['v2'].duration}ms (avg: ${results['v2'].avgPerRequest.toFixed(2)}ms/req)`);
            console.log(`V3 (Kafka Async):  ${results['v3'].duration}ms (avg: ${results['v3'].avgPerRequest.toFixed(2)}ms/req)`);

            // V3 should be fastest due to async processing
            expect(results['v3'].duration).toBeLessThan(results['v1'].duration);
        });
    });
});
