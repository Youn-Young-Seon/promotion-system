import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PointModule } from './point/point.module';
import { RedisModule } from '@app/common';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: 'apps/point-service/.env',
        }),
        RedisModule,
        PointModule,
    ],
})
export class AppModule { }
