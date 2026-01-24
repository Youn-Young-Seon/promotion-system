import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../apps/api-gateway/src/app.module';

describe('Point Service E2E Tests', () => {
  let app: INestApplication;
  const userId = Math.floor(Math.random() * 100000);
  let transactionId: number;

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

  describe('Point Earn Flow', () => {
    it('should earn points', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/points/earn')
        .send({
          userId,
          amount: 5000,
          description: 'E2E Test Earn',
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.type).toBe('EARNED');
      expect(response.body.amount).toBe('5000');
      transactionId = response.body.id;
    });

    it('should get balance', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/v1/points/users/${userId}/balance`)
        .expect(200);

      expect(response.body).toHaveProperty('balance');
      expect(response.body.balance).toBeGreaterThanOrEqual(5000);
    });

    it('should get history', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/v1/points/users/${userId}/history?page=0&size=10`)
        .expect(200);

      expect(response.body).toHaveProperty('points');
      expect(Array.isArray(response.body.points)).toBe(true);
      expect(response.body.points.length).toBeGreaterThan(0);
    });
  });

  describe('Point Use Flow', () => {
    it('should use points', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/points/use')
        .send({
          userId,
          amount: 2000,
          description: 'E2E Test Use',
        })
        .expect(201);

      expect(response.body.type).toBe('SPENT');
      expect(response.body.amount).toBe('-2000');
    });

    it('should not use more than balance', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/points/use')
        .send({
          userId,
          amount: 999999,
          description: 'E2E Test Fail',
        })
        .expect(400);
    });

    it('should cancel points', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/points/cancel')
        .send({
          transactionId,
          description: 'E2E Test Cancel',
        })
        .expect(201);

      expect(response.body.type).toBe('CANCELED');
    });
  });
});
