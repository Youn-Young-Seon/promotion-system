import { Injectable, Logger, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

// gRPC Service Interfaces
interface CouponService {
    createPolicy(data: any): any;
    issueCoupon(data: any): any;
    useCoupon(data: any): any;
    getUserCoupons(data: any): any;
}

interface PointService {
    getBalance(data: any): any;
    getHistory(data: any): any;
    addPoint(data: any): any;
    usePoint(data: any): any;
}

interface TimeSaleService {
    createTimeSale(data: any): any;
    createOrder(data: any): any;
    getTimeSale(data: any): any;
}

@Injectable()
export class GatewayService implements OnModuleInit {
    private readonly logger = new Logger(GatewayService.name);
    private couponService: CouponService;
    private pointService: PointService;
    private timeSaleService: TimeSaleService;

    constructor(
        @Inject('COUPON_SERVICE') private couponClient: ClientGrpc,
        @Inject('POINT_SERVICE') private pointClient: ClientGrpc,
        @Inject('TIMESALE_SERVICE') private timeSaleClient: ClientGrpc,
    ) { }

    onModuleInit() {
        this.couponService = this.couponClient.getService<CouponService>('CouponService');
        this.pointService = this.pointClient.getService<PointService>('PointService');
        this.timeSaleService = this.timeSaleClient.getService<TimeSaleService>('TimeSaleService');
    }

    async callCouponService(method: string, data: any) {
        try {
            this.logger.debug(`Calling Coupon Service: ${method}`);
            const result = await firstValueFrom(this.couponService[method](data));
            return result;
        } catch (error) {
            this.logger.error(`Coupon Service error: ${error.message}`, error.stack);
            throw error;
        }
    }

    async callPointService(method: string, data: any) {
        try {
            this.logger.debug(`Calling Point Service: ${method}`);
            const result = await firstValueFrom(this.pointService[method](data));
            return result;
        } catch (error) {
            this.logger.error(`Point Service error: ${error.message}`, error.stack);
            throw error;
        }
    }

    async callTimeSaleService(method: string, data: any) {
        try {
            this.logger.debug(`Calling TimeSale Service: ${method}`);
            const result = await firstValueFrom(this.timeSaleService[method](data));
            return result;
        } catch (error) {
            this.logger.error(`TimeSale Service error: ${error.message}`, error.stack);
            throw error;
        }
    }
}
