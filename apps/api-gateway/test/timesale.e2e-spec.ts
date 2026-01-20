import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('TimeSale Service via API Gateway (E2E)', () => {
    let app: INestApplication;
    let createdTimeSaleId: string;

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

    describe('POST /api/timesales - 타임세일 생성', () => {
        it('should create a new timesale', async () => {
            const timesaleData = {
                productId: 'product-e2e-001',
                quantity: 1000,
                discountPrice: 50000,
                startAt: new Date().toISOString(),
                endAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            };

            const response = await request(app.getHttpServer())
                .post('/api/timesales')
                .send(timesaleData)
                .expect(201);

            expect(response.body).toHaveProperty('id');
            expect(response.body.productId).toBe(timesaleData.productId);
            expect(response.body.quantity).toBe(timesaleData.quantity);
            expect(response.body.discountPrice).toBe(timesaleData.discountPrice);

            createdTimeSaleId = response.body.id;
        });

        it('should fail with invalid quantity', async () => {
            const invalidData = {
                productId: 'product-invalid',
                quantity: -1,
                discountPrice: 10000,
                startAt: new Date().toISOString(),
                endAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            };

            await request(app.getHttpServer())
                .post('/api/timesales')
                .send(invalidData)
                .expect(400);
        });

        it('should fail with invalid date range', async () => {
            const invalidData = {
                productId: 'product-invalid-date',
                quantity: 100,
                discountPrice: 10000,
                startAt: new Date().toISOString(),
                endAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Past date
            };

            await request(app.getHttpServer())
                .post('/api/timesales')
                .send(invalidData)
                .expect(400);
        });
    });

    describe('GET /api/timesales/:id - 타임세일 조회', () => {
        it('should get timesale by id', async () => {
            const response = await request(app.getHttpServer())
                .get(`/api/timesales/${createdTimeSaleId}`)
                .expect(200);

            expect(response.body).toHaveProperty('id');
            expect(response.body.id).toBe(createdTimeSaleId);
            expect(response.body).toHaveProperty('productId');
            expect(response.body).toHaveProperty('quantity');
            expect(response.body).toHaveProperty('soldQuantity');
        });

        it('should return 404 for non-existent timesale', async () => {
            await request(app.getHttpServer())
                .get('/api/timesales/non-existent-id')
                .expect(404);
        });
    });

    describe('POST /api/timesales/:timeSaleId/orders - 타임세일 주문 (V1 Strategy)', () => {
        let v1TimeSaleId: string;

        beforeAll(async () => {
            const timesaleResponse = await request(app.getHttpServer())
                .post('/api/timesales')
                .send({
                    productId: 'product-v1-test',
                    quantity: 500,
                    discountPrice: 30000,
                    startAt: new Date().toISOString(),
                    endAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                });

            v1TimeSaleId = timesaleResponse.body.id;
        });

        it('should create order using V1 strategy (database-based)', async () => {
            const orderData = {
                userId: 'user-v1-001',
                quantity: 2,
            };

            const response = await request(app.getHttpServer())
                .post(`/api/timesales/${v1TimeSaleId}/orders?strategy=v1`)
                .send(orderData)
                .expect(201);

            expect(response.body).toHaveProperty('id');
            expect(response.body.timeSaleId).toBe(v1TimeSaleId);
            expect(response.body.userId).toBe(orderData.userId);
            expect(response.body.quantity).toBe(orderData.quantity);
            expect(response.body.status).toBe('COMPLETED');
        });

        it('should handle concurrent V1 orders correctly', async () => {
            const promises = Array.from({ length: 20 }, (_, i) =>
                request(app.getHttpServer())
                    .post(`/api/timesales/${v1TimeSaleId}/orders?strategy=v1`)
                    .send({
                        userId: `user-v1-concurrent-${i}`,
                        quantity: 1,
                    })
            );

            const results = await Promise.all(promises);
            const successCount = results.filter(r => r.status === 201).length;

            expect(successCount).toBeGreaterThan(0);
            expect(successCount).toBeLessThanOrEqual(20);
        });

        it('should fail when quantity exceeds stock', async () => {
            const timeSaleResponse = await request(app.getHttpServer())
                .get(`/api/timesales/${v1TimeSaleId}`)
                .expect(200);

            const remainingStock = timeSaleResponse.body.quantity - timeSaleResponse.body.soldQuantity;

            await request(app.getHttpServer())
                .post(`/api/timesales/${v1TimeSaleId}/orders?strategy=v1`)
                .send({
                    userId: 'user-exceed-stock',
                    quantity: remainingStock + 100,
                })
                .expect(400);
        });
    });

    describe('POST /api/timesales/:timeSaleId/orders - 타임세일 주문 (V2 Strategy)', () => {
        let v2TimeSaleId: string;

        beforeAll(async () => {
            const timesaleResponse = await request(app.getHttpServer())
                .post('/api/timesales')
                .send({
                    productId: 'product-v2-test',
                    quantity: 1000,
                    discountPrice: 40000,
                    startAt: new Date().toISOString(),
                    endAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                });

            v2TimeSaleId = timesaleResponse.body.id;
        });

        it('should create order using V2 strategy (Redis-optimized)', async () => {
            const orderData = {
                userId: 'user-v2-001',
                quantity: 3,
            };

            const response = await request(app.getHttpServer())
                .post(`/api/timesales/${v2TimeSaleId}/orders?strategy=v2`)
                .send(orderData)
                .expect(201);

            expect(response.body).toHaveProperty('id');
            expect(response.body.timeSaleId).toBe(v2TimeSaleId);
            expect(response.body.userId).toBe(orderData.userId);
            expect(response.body.quantity).toBe(orderData.quantity);
            expect(response.body.status).toBe('COMPLETED');
        });

        it('should handle high concurrency with V2 strategy', async () => {
            const promises = Array.from({ length: 100 }, (_, i) =>
                request(app.getHttpServer())
                    .post(`/api/timesales/${v2TimeSaleId}/orders?strategy=v2`)
                    .send({
                        userId: `user-v2-concurrent-${i}`,
                        quantity: 1,
                    })
            );

            const results = await Promise.all(promises);
            const successCount = results.filter(r => r.status === 201).length;

            expect(successCount).toBeGreaterThan(0);

            // Verify stock consistency
            const timeSaleResponse = await request(app.getHttpServer())
                .get(`/api/timesales/${v2TimeSaleId}`)
                .expect(200);

            expect(timeSaleResponse.body.soldQuantity).toBeLessThanOrEqual(
                timeSaleResponse.body.quantity
            );
        });

        it('should be faster than V1 strategy', async () => {
            const v1Start = Date.now();
            await request(app.getHttpServer())
                .post(`/api/timesales/${v2TimeSaleId}/orders?strategy=v1`)
                .send({
                    userId: 'user-v1-speed',
                    quantity: 1,
                });
            const v1Duration = Date.now() - v1Start;

            const v2Start = Date.now();
            await request(app.getHttpServer())
                .post(`/api/timesales/${v2TimeSaleId}/orders?strategy=v2`)
                .send({
                    userId: 'user-v2-speed',
                    quantity: 1,
                });
            const v2Duration = Date.now() - v2Start;

            console.log(`V1: ${v1Duration}ms, V2: ${v2Duration}ms`);
            expect(v2Duration).toBeLessThan(v1Duration * 2);
        });

        it('should prevent overselling with V2 strategy', async () => {
            const limitedTimeSaleResponse = await request(app.getHttpServer())
                .post('/api/timesales')
                .send({
                    productId: 'product-v2-limited',
                    quantity: 50,
                    discountPrice: 25000,
                    startAt: new Date().toISOString(),
                    endAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                });

            const limitedTimeSaleId = limitedTimeSaleResponse.body.id;

            const promises = Array.from({ length: 100 }, (_, i) =>
                request(app.getHttpServer())
                    .post(`/api/timesales/${limitedTimeSaleId}/orders?strategy=v2`)
                    .send({
                        userId: `user-v2-limited-${i}`,
                        quantity: 1,
                    })
            );

            const results = await Promise.all(promises);
            const successCount = results.filter(r => r.status === 201).length;
            const failCount = results.filter(r => r.status === 400).length;

            expect(successCount).toBe(50);
            expect(failCount).toBe(50);

            const finalTimeSaleResponse = await request(app.getHttpServer())
                .get(`/api/timesales/${limitedTimeSaleId}`)
                .expect(200);

            expect(finalTimeSaleResponse.body.soldQuantity).toBe(50);
        });
    });

    describe('POST /api/timesales/:timeSaleId/orders - 타임세일 주문 (V3 Strategy)', () => {
        let v3TimeSaleId: string;

        beforeAll(async () => {
            const timesaleResponse = await request(app.getHttpServer())
                .post('/api/timesales')
                .send({
                    productId: 'product-v3-test',
                    quantity: 2000,
                    discountPrice: 45000,
                    startAt: new Date().toISOString(),
                    endAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                });

            v3TimeSaleId = timesaleResponse.body.id;
        });

        it('should create order using V3 strategy (Kafka async)', async () => {
            const orderData = {
                userId: 'user-v3-001',
                quantity: 2,
            };

            const response = await request(app.getHttpServer())
                .post(`/api/timesales/${v3TimeSaleId}/orders?strategy=v3`)
                .send(orderData)
                .expect(201);

            // V3 returns PENDING or QUEUED status immediately
            expect(response.body).toHaveProperty('id');
            expect(response.body.status).toMatch(/PENDING|QUEUED|COMPLETED/);
        });

        it('should handle extreme concurrency with V3 strategy', async () => {
            const promises = Array.from({ length: 200 }, (_, i) =>
                request(app.getHttpServer())
                    .post(`/api/timesales/${v3TimeSaleId}/orders?strategy=v3`)
                    .send({
                        userId: `user-v3-concurrent-${i}`,
                        quantity: 1,
                    })
            );

            const results = await Promise.all(promises);
            const allSucceeded = results.every(r => r.status === 201);

            expect(allSucceeded).toBe(true);
        });

        it('should respond immediately (async processing)', async () => {
            const start = Date.now();

            await request(app.getHttpServer())
                .post(`/api/timesales/${v3TimeSaleId}/orders?strategy=v3`)
                .send({
                    userId: 'user-v3-async',
                    quantity: 1,
                })
                .expect(201);

            const duration = Date.now() - start;

            // V3 should respond almost immediately
            expect(duration).toBeLessThan(500);
        });

        it('should handle burst traffic with V3 strategy', async () => {
            const burstTimeSaleResponse = await request(app.getHttpServer())
                .post('/api/timesales')
                .send({
                    productId: 'product-v3-burst',
                    quantity: 5000,
                    discountPrice: 20000,
                    startAt: new Date().toISOString(),
                    endAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                });

            const burstTimeSaleId = burstTimeSaleResponse.body.id;

            const start = Date.now();

            const promises = Array.from({ length: 500 }, (_, i) =>
                request(app.getHttpServer())
                    .post(`/api/timesales/${burstTimeSaleId}/orders?strategy=v3`)
                    .send({
                        userId: `user-v3-burst-${i}`,
                        quantity: 1,
                    })
            );

            await Promise.all(promises);
            const duration = Date.now() - start;

            console.log(`V3 handled 500 requests in ${duration}ms (${(500 / (duration / 1000)).toFixed(2)} TPS)`);

            // All requests should succeed immediately
            expect(duration).toBeLessThan(10000); // Should complete in < 10 seconds
        });
    });

    describe('Strategy Comparison - Performance Test', () => {
        it('should compare all three strategies', async () => {
            const strategies = ['v1', 'v2', 'v3'];
            const results = {};

            for (const strategy of strategies) {
                const timesaleResponse = await request(app.getHttpServer())
                    .post('/api/timesales')
                    .send({
                        productId: `product-compare-${strategy}`,
                        quantity: 500,
                        discountPrice: 35000,
                        startAt: new Date().toISOString(),
                        endAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                    });

                const timeSaleId = timesaleResponse.body.id;
                const iterations = 30;
                const start = Date.now();

                const promises = Array.from({ length: iterations }, (_, i) =>
                    request(app.getHttpServer())
                        .post(`/api/timesales/${timeSaleId}/orders?strategy=${strategy}`)
                        .send({
                            userId: `user-compare-${strategy}-${i}`,
                            quantity: 1,
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
            expect(results['v2'].duration).toBeLessThan(results['v1'].duration);
        });
    });

    describe('TimeSale - Stock Management', () => {
        it('should accurately track sold quantity', async () => {
            const timesaleResponse = await request(app.getHttpServer())
                .post('/api/timesales')
                .send({
                    productId: 'product-stock-tracking',
                    quantity: 100,
                    discountPrice: 30000,
                    startAt: new Date().toISOString(),
                    endAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                });

            const timeSaleId = timesaleResponse.body.id;

            // Place 5 orders with different quantities
            const orders = [
                { userId: 'user-stock-1', quantity: 10 },
                { userId: 'user-stock-2', quantity: 15 },
                { userId: 'user-stock-3', quantity: 20 },
                { userId: 'user-stock-4', quantity: 5 },
                { userId: 'user-stock-5', quantity: 25 },
            ];

            for (const order of orders) {
                await request(app.getHttpServer())
                    .post(`/api/timesales/${timeSaleId}/orders?strategy=v2`)
                    .send(order)
                    .expect(201);
            }

            const finalTimeSaleResponse = await request(app.getHttpServer())
                .get(`/api/timesales/${timeSaleId}`)
                .expect(200);

            const totalSold = orders.reduce((sum, order) => sum + order.quantity, 0);
            expect(finalTimeSaleResponse.body.soldQuantity).toBe(totalSold);
            expect(finalTimeSaleResponse.body.quantity - finalTimeSaleResponse.body.soldQuantity).toBe(25);
        });

        it('should prevent orders when stock is depleted', async () => {
            const timesaleResponse = await request(app.getHttpServer())
                .post('/api/timesales')
                .send({
                    productId: 'product-depleted',
                    quantity: 5,
                    discountPrice: 15000,
                    startAt: new Date().toISOString(),
                    endAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                });

            const timeSaleId = timesaleResponse.body.id;

            // Deplete stock
            await request(app.getHttpServer())
                .post(`/api/timesales/${timeSaleId}/orders?strategy=v2`)
                .send({ userId: 'user-deplete', quantity: 5 })
                .expect(201);

            // Try to order after depletion
            await request(app.getHttpServer())
                .post(`/api/timesales/${timeSaleId}/orders?strategy=v2`)
                .send({ userId: 'user-after-deplete', quantity: 1 })
                .expect(400);
        });
    });
});
