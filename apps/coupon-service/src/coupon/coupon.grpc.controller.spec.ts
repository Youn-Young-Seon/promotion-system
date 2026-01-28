import { Test, TestingModule } from '@nestjs/testing';
import { CouponGrpcController } from './coupon.grpc.controller';
import { CouponService } from './coupon.service';
import { CouponStatus } from '../../prisma/generated/client';

describe('CouponGrpcController', () => {
  let controller: CouponGrpcController;
  let service: CouponService;

  const mockCouponService = {
    issueCoupon: jest.fn(),
    useCoupon: jest.fn(),
    cancelCoupon: jest.fn(),
    getUserCoupons: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CouponGrpcController],
      providers: [
        {
          provide: CouponService,
          useValue: mockCouponService,
        },
      ],
    }).compile();

    controller = module.get<CouponGrpcController>(CouponGrpcController);
    service = module.get<CouponService>(CouponService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('issueCoupon', () => {
    it('should issue a coupon successfully with coupon policy', async () => {
      const mockCoupon = {
        id: BigInt(1),
        userId: BigInt(100),
        couponPolicyId: BigInt(1),
        orderId: null,
        status: CouponStatus.AVAILABLE,
        expirationTime: new Date('2026-12-31'),
        issuedAt: new Date('2026-01-01'),
        usedAt: null,
        couponPolicy: {
          id: BigInt(1),
          title: 'New Year Sale',
          discountType: 'PERCENTAGE',
          discountValue: 20,
        },
      };

      mockCouponService.issueCoupon.mockResolvedValue(mockCoupon);

      const result = await controller.issueCoupon({
        userId: '100',
        couponPolicyId: '1',
      });

      expect(service.issueCoupon).toHaveBeenCalledWith({
        userId: 100,
        couponPolicyId: 1,
      });

      expect(result).toEqual({
        coupon: {
          id: '1',
          userId: '100',
          orderId: '0',
          status: CouponStatus.AVAILABLE,
          expirationTime: mockCoupon.expirationTime.toISOString(),
          issuedAt: mockCoupon.issuedAt.toISOString(),
          policy: {
            id: '1',
            title: 'New Year Sale',
            discountType: 'PERCENTAGE',
            discountValue: 20,
          },
        },
      });
    });

    it('should issue a coupon successfully without coupon policy', async () => {
      const mockCoupon = {
        id: BigInt(1),
        userId: BigInt(100),
        couponPolicyId: BigInt(1),
        orderId: null,
        status: CouponStatus.AVAILABLE,
        expirationTime: new Date('2026-12-31'),
        issuedAt: new Date('2026-01-01'),
        usedAt: null,
        couponPolicy: null,
      };

      mockCouponService.issueCoupon.mockResolvedValue(mockCoupon);

      const result = await controller.issueCoupon({
        userId: 100,
        couponPolicyId: 1,
      });

      expect(result).toEqual({
        coupon: {
          id: '1',
          userId: '100',
          orderId: '0',
          status: CouponStatus.AVAILABLE,
          expirationTime: mockCoupon.expirationTime.toISOString(),
          issuedAt: mockCoupon.issuedAt.toISOString(),
        },
      });
    });

    it('should handle string parameters', async () => {
      const mockCoupon = {
        id: BigInt(1),
        userId: BigInt(200),
        couponPolicyId: BigInt(2),
        orderId: null,
        status: CouponStatus.AVAILABLE,
        expirationTime: new Date('2026-12-31'),
        issuedAt: new Date('2026-01-01'),
        usedAt: null,
        couponPolicy: null,
      };

      mockCouponService.issueCoupon.mockResolvedValue(mockCoupon);

      await controller.issueCoupon({
        userId: '200',
        couponPolicyId: '2',
      });

      expect(service.issueCoupon).toHaveBeenCalledWith({
        userId: 200,
        couponPolicyId: 2,
      });
    });
  });

  describe('useCoupon', () => {
    it('should use a coupon successfully', async () => {
      const mockCoupon = {
        id: BigInt(1),
        userId: BigInt(100),
        couponPolicyId: BigInt(1),
        orderId: BigInt(500),
        status: CouponStatus.USED,
        expirationTime: new Date('2026-12-31'),
        issuedAt: new Date('2026-01-01'),
        usedAt: new Date('2026-01-15'),
      };

      mockCouponService.useCoupon.mockResolvedValue(mockCoupon);

      const result = await controller.useCoupon({
        couponId: '1',
        orderId: '500',
        orderAmount: 10000,
      });

      expect(service.useCoupon).toHaveBeenCalledWith(1, {
        orderId: 500,
        orderAmount: 10000,
      });

      expect(result).toEqual({
        coupon: {
          id: '1',
          userId: '100',
          orderId: '500',
          status: CouponStatus.USED,
          expirationTime: mockCoupon.expirationTime.toISOString(),
          issuedAt: mockCoupon.issuedAt.toISOString(),
        },
      });
    });

    it('should handle number parameters', async () => {
      const mockCoupon = {
        id: BigInt(2),
        userId: BigInt(100),
        couponPolicyId: BigInt(1),
        orderId: BigInt(600),
        status: CouponStatus.USED,
        expirationTime: new Date('2026-12-31'),
        issuedAt: new Date('2026-01-01'),
        usedAt: new Date('2026-01-15'),
      };

      mockCouponService.useCoupon.mockResolvedValue(mockCoupon);

      await controller.useCoupon({
        couponId: 2,
        orderId: 600,
        orderAmount: 15000,
      });

      expect(service.useCoupon).toHaveBeenCalledWith(2, {
        orderId: 600,
        orderAmount: 15000,
      });
    });
  });

  describe('cancelCoupon', () => {
    it('should cancel a coupon successfully', async () => {
      const mockCoupon = {
        id: BigInt(1),
        userId: BigInt(100),
        couponPolicyId: BigInt(1),
        orderId: null,
        status: CouponStatus.CANCELED,
        expirationTime: new Date('2026-12-31'),
        issuedAt: new Date('2026-01-01'),
        usedAt: null,
      };

      mockCouponService.cancelCoupon.mockResolvedValue(mockCoupon);

      const result = await controller.cancelCoupon({ couponId: '1' });

      expect(service.cancelCoupon).toHaveBeenCalledWith(1);

      expect(result).toEqual({
        coupon: {
          id: '1',
          userId: '100',
          orderId: '0',
          status: CouponStatus.CANCELED,
          expirationTime: mockCoupon.expirationTime.toISOString(),
          issuedAt: mockCoupon.issuedAt.toISOString(),
        },
      });
    });

    it('should handle number parameter', async () => {
      const mockCoupon = {
        id: BigInt(5),
        userId: BigInt(100),
        couponPolicyId: BigInt(1),
        orderId: null,
        status: CouponStatus.CANCELED,
        expirationTime: new Date('2026-12-31'),
        issuedAt: new Date('2026-01-01'),
        usedAt: null,
      };

      mockCouponService.cancelCoupon.mockResolvedValue(mockCoupon);

      await controller.cancelCoupon({ couponId: 5 });

      expect(service.cancelCoupon).toHaveBeenCalledWith(5);
    });
  });

  describe('getUserCoupons', () => {
    it('should get user coupons successfully', async () => {
      const mockCoupons = [
        {
          id: BigInt(1),
          userId: BigInt(100),
          couponPolicyId: BigInt(1),
          orderId: null,
          status: CouponStatus.AVAILABLE,
          expirationTime: new Date('2026-12-31'),
          issuedAt: new Date('2026-01-01'),
          usedAt: null,
          couponPolicy: {
            id: BigInt(1),
            title: 'Winter Sale',
            discountType: 'FIXED',
            discountValue: 5000,
          },
        },
        {
          id: BigInt(2),
          userId: BigInt(100),
          couponPolicyId: BigInt(2),
          orderId: BigInt(500),
          status: CouponStatus.USED,
          expirationTime: new Date('2026-12-31'),
          issuedAt: new Date('2026-01-02'),
          usedAt: new Date('2026-01-10'),
          couponPolicy: {
            id: BigInt(2),
            title: 'Spring Sale',
            discountType: 'PERCENTAGE',
            discountValue: 15,
          },
        },
      ];

      mockCouponService.getUserCoupons.mockResolvedValue(mockCoupons);

      const result = await controller.getUserCoupons({ userId: '100' });

      expect(service.getUserCoupons).toHaveBeenCalledWith(100);

      expect(result).toEqual({
        coupons: [
          {
            id: '1',
            userId: '100',
            orderId: '0',
            status: CouponStatus.AVAILABLE,
            expirationTime: mockCoupons[0]!.expirationTime.toISOString(),
            issuedAt: mockCoupons[0]!.issuedAt.toISOString(),
            policy: {
              id: '1',
              title: 'Winter Sale',
              discountType: 'FIXED',
              discountValue: 5000,
            },
          },
          {
            id: '2',
            userId: '100',
            orderId: '500',
            status: CouponStatus.USED,
            expirationTime: mockCoupons[1]!.expirationTime.toISOString(),
            issuedAt: mockCoupons[1]!.issuedAt.toISOString(),
            policy: {
              id: '2',
              title: 'Spring Sale',
              discountType: 'PERCENTAGE',
              discountValue: 15,
            },
          },
        ],
      });
    });

    it('should handle empty coupon list', async () => {
      mockCouponService.getUserCoupons.mockResolvedValue([]);

      const result = await controller.getUserCoupons({ userId: 100 });

      expect(result).toEqual({ coupons: [] });
    });

    it('should handle coupons without policy', async () => {
      const mockCoupons = [
        {
          id: BigInt(1),
          userId: BigInt(100),
          couponPolicyId: BigInt(1),
          orderId: null,
          status: CouponStatus.AVAILABLE,
          expirationTime: new Date('2026-12-31'),
          issuedAt: new Date('2026-01-01'),
          usedAt: null,
          couponPolicy: null,
        },
      ];

      mockCouponService.getUserCoupons.mockResolvedValue(mockCoupons);

      const result = await controller.getUserCoupons({ userId: 100 });

      expect(result.coupons[0]).not.toHaveProperty('policy');
    });
  });
});
