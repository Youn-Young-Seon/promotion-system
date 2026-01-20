import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Point Service via API Gateway (E2E)', () => {
    let app: INestApplication;
    const testUserId = 'point-test-user-001';

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

    describe('POST /api/points/add - 적립금 적립', () => {
        it('should add points successfully', async () => {
            const addData = {
                userId: testUserId,
                amount: 5000,
                description: '회원가입 축하 적립금',
            };

            const response = await request(app.getHttpServer())
                .post('/api/points/add')
                .send(addData)
                .expect(201);

            expect(response.body).toHaveProperty('id');
            expect(response.body.userId).toBe(testUserId);
            expect(response.body.type).toBe('ADD');
            expect(response.body.amount).toBe(5000);
            expect(response.body.description).toBe(addData.description);
        });

        it('should add multiple points to the same user', async () => {
            const amounts = [1000, 2000, 3000];

            for (const amount of amounts) {
                const response = await request(app.getHttpServer())
                    .post('/api/points/add')
                    .send({
                        userId: testUserId,
                        amount,
                        description: `${amount}원 적립`,
                    })
                    .expect(201);

                expect(response.body.amount).toBe(amount);
            }
        });

        it('should handle concurrent point additions', async () => {
            const concurrentUserId = 'concurrent-add-user';
            const promises = Array.from({ length: 10 }, (_, i) =>
                request(app.getHttpServer())
                    .post('/api/points/add')
                    .send({
                        userId: concurrentUserId,
                        amount: 100,
                        description: `동시 적립 ${i}`,
                    })
            );

            const results = await Promise.all(promises);
            const allSucceeded = results.every(r => r.status === 201);

            expect(allSucceeded).toBe(true);

            // Verify final balance
            const balanceResponse = await request(app.getHttpServer())
                .get(`/api/points/balance/${concurrentUserId}`)
                .expect(200);

            expect(balanceResponse.body.balance).toBe(1000); // 100 * 10
        });

        it('should fail with invalid amount', async () => {
            await request(app.getHttpServer())
                .post('/api/points/add')
                .send({
                    userId: testUserId,
                    amount: -1000,
                    description: '잘못된 금액',
                })
                .expect(400);
        });

        it('should fail with missing userId', async () => {
            await request(app.getHttpServer())
                .post('/api/points/add')
                .send({
                    amount: 1000,
                    description: 'userId 누락',
                })
                .expect(400);
        });
    });

    describe('GET /api/points/balance/:userId - 적립금 잔액 조회', () => {
        it('should get point balance', async () => {
            const response = await request(app.getHttpServer())
                .get(`/api/points/balance/${testUserId}`)
                .expect(200);

            expect(response.body).toHaveProperty('userId');
            expect(response.body).toHaveProperty('balance');
            expect(response.body.userId).toBe(testUserId);
            expect(response.body.balance).toBeGreaterThan(0);
        });

        it('should return zero balance for new user', async () => {
            const newUserId = 'new-user-no-points';

            const response = await request(app.getHttpServer())
                .get(`/api/points/balance/${newUserId}`)
                .expect(200);

            expect(response.body.userId).toBe(newUserId);
            expect(response.body.balance).toBe(0);
        });

        it('should handle special characters in userId', async () => {
            const specialUserId = 'user@email.com';

            // Add some points first
            await request(app.getHttpServer())
                .post('/api/points/add')
                .send({
                    userId: specialUserId,
                    amount: 1000,
                    description: '특수문자 테스트',
                });

            const response = await request(app.getHttpServer())
                .get(`/api/points/balance/${encodeURIComponent(specialUserId)}`)
                .expect(200);

            expect(response.body.balance).toBe(1000);
        });
    });

    describe('POST /api/points/use - 적립금 사용', () => {
        const useTestUserId = 'point-use-test-user';

        beforeAll(async () => {
            // Add initial points for testing
            await request(app.getHttpServer())
                .post('/api/points/add')
                .send({
                    userId: useTestUserId,
                    amount: 10000,
                    description: '초기 적립금',
                });
        });

        it('should use points successfully', async () => {
            const useData = {
                userId: useTestUserId,
                amount: 3000,
                description: '상품 구매 사용',
            };

            const response = await request(app.getHttpServer())
                .post('/api/points/use')
                .send(useData)
                .expect(201);

            expect(response.body).toHaveProperty('id');
            expect(response.body.userId).toBe(useTestUserId);
            expect(response.body.type).toBe('USE');
            expect(response.body.amount).toBe(3000);
        });

        it('should fail when using more than available balance', async () => {
            const balanceResponse = await request(app.getHttpServer())
                .get(`/api/points/balance/${useTestUserId}`)
                .expect(200);

            const currentBalance = balanceResponse.body.balance;

            await request(app.getHttpServer())
                .post('/api/points/use')
                .send({
                    userId: useTestUserId,
                    amount: currentBalance + 1000,
                    description: '잔액 초과 사용',
                })
                .expect(400);
        });

        it('should handle concurrent point usage (pessimistic locking)', async () => {
            const concurrentUserId = 'concurrent-use-user';

            // Add initial balance
            await request(app.getHttpServer())
                .post('/api/points/add')
                .send({
                    userId: concurrentUserId,
                    amount: 5000,
                    description: '초기 잔액',
                });

            // Try to use 1000 points 10 times concurrently
            const promises = Array.from({ length: 10 }, () =>
                request(app.getHttpServer())
                    .post('/api/points/use')
                    .send({
                        userId: concurrentUserId,
                        amount: 1000,
                        description: '동시 사용',
                    })
            );

            const results = await Promise.all(promises);
            const successCount = results.filter(r => r.status === 201).length;
            const failCount = results.filter(r => r.status === 400).length;

            // Only 5 should succeed (5000 / 1000)
            expect(successCount).toBe(5);
            expect(failCount).toBe(5);

            // Verify final balance is 0
            const balanceResponse = await request(app.getHttpServer())
                .get(`/api/points/balance/${concurrentUserId}`)
                .expect(200);

            expect(balanceResponse.body.balance).toBe(0);
        });

        it('should use exact balance amount', async () => {
            const exactUserId = 'exact-use-user';

            await request(app.getHttpServer())
                .post('/api/points/add')
                .send({
                    userId: exactUserId,
                    amount: 2500,
                    description: '정확한 금액 테스트',
                });

            const response = await request(app.getHttpServer())
                .post('/api/points/use')
                .send({
                    userId: exactUserId,
                    amount: 2500,
                    description: '전액 사용',
                })
                .expect(201);

            expect(response.body.amount).toBe(2500);

            const balanceResponse = await request(app.getHttpServer())
                .get(`/api/points/balance/${exactUserId}`)
                .expect(200);

            expect(balanceResponse.body.balance).toBe(0);
        });
    });

    describe('GET /api/points/history/:userId - 적립금 내역 조회', () => {
        const historyUserId = 'history-test-user';

        beforeAll(async () => {
            // Create transaction history
            await request(app.getHttpServer())
                .post('/api/points/add')
                .send({
                    userId: historyUserId,
                    amount: 5000,
                    description: '첫 번째 적립',
                });

            await request(app.getHttpServer())
                .post('/api/points/use')
                .send({
                    userId: historyUserId,
                    amount: 2000,
                    description: '첫 번째 사용',
                });

            await request(app.getHttpServer())
                .post('/api/points/add')
                .send({
                    userId: historyUserId,
                    amount: 3000,
                    description: '두 번째 적립',
                });
        });

        it('should get point history', async () => {
            const response = await request(app.getHttpServer())
                .get(`/api/points/history/${historyUserId}`)
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThanOrEqual(3);

            const transaction = response.body[0];
            expect(transaction).toHaveProperty('id');
            expect(transaction).toHaveProperty('userId');
            expect(transaction).toHaveProperty('type');
            expect(transaction).toHaveProperty('amount');
            expect(transaction).toHaveProperty('description');
            expect(transaction).toHaveProperty('createdAt');
        });

        it('should support pagination', async () => {
            const page1Response = await request(app.getHttpServer())
                .get(`/api/points/history/${historyUserId}?page=1&limit=2`)
                .expect(200);

            expect(page1Response.body.length).toBeLessThanOrEqual(2);

            const page2Response = await request(app.getHttpServer())
                .get(`/api/points/history/${historyUserId}?page=2&limit=2`)
                .expect(200);

            expect(Array.isArray(page2Response.body)).toBe(true);
        });

        it('should return empty array for user with no history', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/points/history/no-history-user')
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(0);
        });

        it('should order transactions by creation date (newest first)', async () => {
            const response = await request(app.getHttpServer())
                .get(`/api/points/history/${historyUserId}`)
                .expect(200);

            if (response.body.length > 1) {
                const dates = response.body.map(t => new Date(t.createdAt).getTime());

                for (let i = 0; i < dates.length - 1; i++) {
                    expect(dates[i]).toBeGreaterThanOrEqual(dates[i + 1]);
                }
            }
        });
    });

    describe('Point Service - Integration Scenarios', () => {
        const integrationUserId = 'integration-test-user';

        it('should handle complete user journey', async () => {
            // 1. Check initial balance (should be 0)
            let balanceResponse = await request(app.getHttpServer())
                .get(`/api/points/balance/${integrationUserId}`)
                .expect(200);
            expect(balanceResponse.body.balance).toBe(0);

            // 2. Add points (welcome bonus)
            await request(app.getHttpServer())
                .post('/api/points/add')
                .send({
                    userId: integrationUserId,
                    amount: 10000,
                    description: '가입 축하 적립금',
                })
                .expect(201);

            // 3. Check balance after add
            balanceResponse = await request(app.getHttpServer())
                .get(`/api/points/balance/${integrationUserId}`)
                .expect(200);
            expect(balanceResponse.body.balance).toBe(10000);

            // 4. Use some points
            await request(app.getHttpServer())
                .post('/api/points/use')
                .send({
                    userId: integrationUserId,
                    amount: 3000,
                    description: '상품 구매',
                })
                .expect(201);

            // 5. Check balance after use
            balanceResponse = await request(app.getHttpServer())
                .get(`/api/points/balance/${integrationUserId}`)
                .expect(200);
            expect(balanceResponse.body.balance).toBe(7000);

            // 6. Add more points (purchase reward)
            await request(app.getHttpServer())
                .post('/api/points/add')
                .send({
                    userId: integrationUserId,
                    amount: 500,
                    description: '구매 보상',
                })
                .expect(201);

            // 7. Final balance check
            balanceResponse = await request(app.getHttpServer())
                .get(`/api/points/balance/${integrationUserId}`)
                .expect(200);
            expect(balanceResponse.body.balance).toBe(7500);

            // 8. Check history
            const historyResponse = await request(app.getHttpServer())
                .get(`/api/points/history/${integrationUserId}`)
                .expect(200);

            expect(historyResponse.body.length).toBe(3);
        });

        it('should maintain data consistency under stress', async () => {
            const stressUserId = 'stress-test-user';
            const initialAmount = 50000;

            // Add initial balance
            await request(app.getHttpServer())
                .post('/api/points/add')
                .send({
                    userId: stressUserId,
                    amount: initialAmount,
                    description: '스트레스 테스트 초기 잔액',
                });

            // Concurrent adds and uses
            const operations = [];

            // Add 10 x 1000
            for (let i = 0; i < 10; i++) {
                operations.push(
                    request(app.getHttpServer())
                        .post('/api/points/add')
                        .send({
                            userId: stressUserId,
                            amount: 1000,
                            description: `스트레스 적립 ${i}`,
                        })
                );
            }

            // Use 20 x 500
            for (let i = 0; i < 20; i++) {
                operations.push(
                    request(app.getHttpServer())
                        .post('/api/points/use')
                        .send({
                            userId: stressUserId,
                            amount: 500,
                            description: `스트레스 사용 ${i}`,
                        })
                );
            }

            await Promise.all(operations);

            // Expected: 50000 + (10 * 1000) - (20 * 500) = 50000
            const balanceResponse = await request(app.getHttpServer())
                .get(`/api/points/balance/${stressUserId}`)
                .expect(200);

            expect(balanceResponse.body.balance).toBe(50000);
        });
    });
});
