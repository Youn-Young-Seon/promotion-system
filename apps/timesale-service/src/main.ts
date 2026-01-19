import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
        }),
    );

    app.setGlobalPrefix('api');

    // Swagger 설정
    const config = new DocumentBuilder()
        .setTitle('Time Sale Service API')
        .setDescription('타임세일 상품 및 주문 관리 API')
        .setVersion('1.0')
        .addTag('timesales')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    // gRPC Microservice 설정
    app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.GRPC,
        options: {
            package: 'timesale',
            protoPath: join(__dirname, '../../../proto/timesale.proto'),
            url: process.env.GRPC_URL || '0.0.0.0:5003',
        },
    });

    await app.startAllMicroservices();

    const port = process.env.PORT || 3003;
    await app.listen(port);

    console.log(`Time Sale Service is running on: http://localhost:${port}`);
    console.log(`TimeSale gRPC Service is running on: ${process.env.GRPC_URL || '0.0.0.0:5003'}`);
    console.log(`Swagger docs available at: http://localhost:${port}/api/docs`);
}
bootstrap();
