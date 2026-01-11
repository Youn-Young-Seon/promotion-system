import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PointModule } from './point/point.module';
import { RedisModule } from '@app/common';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        RedisModule,
        PointModule,
    ],
})
export class AppModule { }
