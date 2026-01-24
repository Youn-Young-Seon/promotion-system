import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../apps/api-gateway/src/app.module';

describe('Coupon Service E2E Tests', () => {
  let app: INestApplication;
  let policyId: number;
  let couponId: number;
  const userId = Math.floor(Math.random() * 100000);

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );

    app.setGlobalPrefix('api/v1');
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Coupon Policy Flow', () => {
    it('should create a coupon policy', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/coupon-policies')
        .send({
          title: 'E2E Test Coupon',
          description: 'For E2E testing',
          totalQuantity: 10,
          startTime: new Date(Date.now() - 1000).toISOString(),
          endTime: new Date(Date.now() + 86400000).toISOString(),
          discountType: 'PERCENTAGE',
          discountValue: 20,
          minimumOrderAmount: 10000,
          maximumDiscountAmount: 5000,
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe('E2E Test Coupon');
      policyId = response.body.id;
    });

    it('should get coupon policy by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/v1/coupon-policies/${policyId}`)
        .expect(200);

      expect(response.body.id).toBe(policyId);
      expect(response.body.title).toBe('E2E Test Coupon');
    });

    it('should list coupon policies', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/coupon-policies?page=0&size=10')
        .expect(200);

      expect(response.body).toHaveProperty('policies');
      expect(Array.isArray(response.body.policies)).toBe(true);
    });
  });

  describe('Coupon Issuance Flow', () => {
    it('should issue a coupon', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/coupons/issue')
        .send({
          userId,
          couponPolicyId: policyId,
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.status).toBe('AVAILABLE');
      couponId = response.body.id;
    });

    it('should get user coupons', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/v1/coupons/user/${userId}`)
        .expect(200);

      expect(response.body).toHaveProperty('coupons');
      expect(Array.isArray(response.body.coupons)).toBe(true);
      expect(response.body.coupons.length).toBeGreaterThan(0);
    });

    it('should use a coupon', async () => {
      const response = await request(app.getHttpServer())
        .post(`/api/v1/coupons/${couponId}/use`)
        .send({
          orderId: 12345,
          orderAmount: 50000,
        })
        .expect(200);

      expect(response.body.status).toBe('USED');
      expect(response.body.orderId).toBeDefined();
    });

    it('should not use already used coupon', async () => {
      await request(app.getHttpServer())
        .post(`/api/v1/coupons/${couponId}/use`)
        .send({
          orderId: 12346,
          orderAmount: 50000,
        })
        .expect(400);
    });
  });
});
