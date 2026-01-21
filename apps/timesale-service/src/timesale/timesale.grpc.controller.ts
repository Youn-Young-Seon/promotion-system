import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { TimeSaleService } from './timesale.service';
import { isOrderCreated, isOrderQueued } from './dto';

interface CreateTimeSaleRequest {
    productId: string;
    quantity: string;
    discountPrice: string;
    startAt: string;
    endAt: string;
}

interface CreateOrderRequest {
    timeSaleId: string;
    userId: string;
    quantity: string;
    strategy?: string;
}

interface GetTimeSaleRequest {
    id: string;
}

@Controller()
export class TimeSaleGrpcController {
    constructor(private readonly timeSaleService: TimeSaleService) { }

    @GrpcMethod('TimeSaleService', 'CreateTimeSale')
    async createTimeSale(data: CreateTimeSaleRequest) {
        const dto = {
            productId: data.productId,
            quantity: parseInt(data.quantity),
            discountPrice: parseInt(data.discountPrice),
            startAt: data.startAt,
            endAt: data.endAt,
        };

        const result = await this.timeSaleService.createTimeSale(dto);

        return {
            id: result.id,
            productId: result.productId,
            quantity: result.quantity,
            remainingQuantity: result.remainingQuantity,
            discountPrice: result.discountPrice,
            startAt: result.createdAt.toISOString(),
            endAt: result.createdAt.toISOString(),
            status: result.status,
        };
    }

    @GrpcMethod('TimeSaleService', 'CreateOrder')
    async createOrder(data: CreateOrderRequest) {
        const dto = {
            userId: data.userId,
            quantity: parseInt(data.quantity),
        };

        const result = await this.timeSaleService.createOrder(
            BigInt(data.timeSaleId),
            dto,
            data.strategy || 'v1'
        );

        // Use type guard for discriminated union
        if (isOrderQueued(result)) {
            // V3: Queued response
            return {
                id: '',
                userId: result.userId,
                timeSaleId: result.timeSaleId,
                quantity: data.quantity,
                status: result.status,
                message: result.message,
            };
        }

        // V1 and V2: Order created response (TypeScript knows this is OrderCreatedResponse)
        return {
            id: result.id,
            userId: result.userId,
            timeSaleId: result.timeSaleId,
            quantity: result.quantity,
            status: result.status,
            message: 'Order created successfully',
        };
    }

    @GrpcMethod('TimeSaleService', 'GetTimeSale')
    async getTimeSale(data: GetTimeSaleRequest) {
        const result = await this.timeSaleService.getTimeSale(BigInt(data.id));

        return {
            timeSale: {
                id: result.id,
                productId: result.product.id,
                quantity: result.quantity,
                remainingQuantity: result.remainingQuantity,
                discountPrice: result.discountPrice,
                startAt: result.startAt.toISOString(),
                endAt: result.endAt.toISOString(),
                status: result.status,
            },
        };
    }
}
