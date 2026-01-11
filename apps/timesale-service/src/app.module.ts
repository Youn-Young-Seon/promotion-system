import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TimeSaleModule } from './timesale/timesale.module';
import { RedisModule, KafkaModule } from '@app/common';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        RedisModule,
        KafkaModule,
        TimeSaleModule,
    ],
})
export class AppModule { }
