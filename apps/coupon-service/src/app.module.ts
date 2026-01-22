import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CouponModule } from './coupon/coupon.module';
import { RedisModule, KafkaModule } from '@app/common';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        RedisModule,
        KafkaModule,
        CouponModule,
    ],
})
export class AppModule { }
