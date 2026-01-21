import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { join } from 'path';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const logger = new Logger('Bootstrap');

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            forbidNonWhitelisted: true,
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
    const grpcUrl = process.env.GRPC_URL || '0.0.0.0:5003';
    app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.GRPC,
        options: {
            package: 'timesale',
            protoPath: join(__dirname, '../../../proto/timesale.proto'),
            url: grpcUrl,
        },
    });

    await app.startAllMicroservices();

    const port = process.env.PORT || 3003;
    await app.listen(port);

    logger.log(`Time Sale Service is running on: http://localhost:${port}`);
    logger.log(`TimeSale gRPC Service is running on: ${grpcUrl}`);
    logger.log(`Swagger docs available at: http://localhost:${port}/api/docs`);
}
bootstrap();
