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
        .setTitle('Point Service API')
        .setDescription('적립금 조회 및 관리 API')
        .setVersion('1.0')
        .addTag('points')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    // gRPC Microservice 설정
    app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.GRPC,
        options: {
            package: 'point',
            protoPath: join(__dirname, '../../../proto/point.proto'),
            url: process.env.GRPC_URL || '0.0.0.0:5002',
        },
    });

    await app.startAllMicroservices();

    const port = process.env.PORT || 3002;
    await app.listen(port);

    console.log(`Point Service is running on: http://localhost:${port}`);
    console.log(`Point gRPC Service is running on: ${process.env.GRPC_URL || '0.0.0.0:5002'}`);
    console.log(`Swagger docs available at: http://localhost:${port}/api/docs`);
}
bootstrap();
