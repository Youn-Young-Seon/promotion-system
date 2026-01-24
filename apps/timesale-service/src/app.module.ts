import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisModule, KafkaModule } from '@common/index';
import { ProductModule } from './product/product.module';
import { TimeSaleModule } from './timesale/timesale.module';
import { OrderModule } from './order/order.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    RedisModule,
    KafkaModule,
    ProductModule,
    TimeSaleModule,
    OrderModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
