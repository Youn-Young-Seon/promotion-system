import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Kafka, Producer, Consumer, EachMessagePayload } from 'kafkajs';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
    private kafka: Kafka;
    private producer: Producer;
    private consumers: Map<string, Consumer> = new Map();

    constructor() {
        this.kafka = new Kafka({
            clientId: 'promotion-system',
            brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
        });
        this.producer = this.kafka.producer();
    }

    async onModuleInit() {
        await this.producer.connect();
        console.log('Kafka Producer connected');
    }

    async onModuleDestroy() {
        await this.producer.disconnect();

        for (const [groupId, consumer] of this.consumers.entries()) {
            await consumer.disconnect();
            console.log(`Kafka Consumer disconnected: ${groupId}`);
        }
    }

    // 메시지 전송
    async sendMessage(topic: string, message: any): Promise<void> {
        await this.producer.send({
            topic,
            messages: [
                {
                    value: JSON.stringify(message),
                    timestamp: Date.now().toString(),
                },
            ],
        });
    }

    // 메시지 일괄 전송
    async sendMessages(topic: string, messages: any[]): Promise<void> {
        await this.producer.send({
            topic,
            messages: messages.map((msg) => ({
                value: JSON.stringify(msg),
                timestamp: Date.now().toString(),
            })),
        });
    }

    // Consumer 등록 및 시작
    async subscribe(
        topic: string,
        groupId: string,
        handler: (payload: EachMessagePayload) => Promise<void>,
    ): Promise<void> {
        const consumer = this.kafka.consumer({ groupId });

        await consumer.connect();
        await consumer.subscribe({ topic, fromBeginning: false });

        await consumer.run({
            eachMessage: async (payload) => {
                try {
                    await handler(payload);
                } catch (error) {
                    console.error(`Error processing message from topic ${topic}:`, error);
                    // 에러 처리 로직 (DLQ 전송 등)
                }
            },
        });

        this.consumers.set(groupId, consumer);
        console.log(`Kafka Consumer started: ${groupId} on topic ${topic}`);
    }

    // Consumer 중지
    async unsubscribe(groupId: string): Promise<void> {
        const consumer = this.consumers.get(groupId);
        if (consumer) {
            await consumer.disconnect();
            this.consumers.delete(groupId);
            console.log(`Kafka Consumer stopped: ${groupId}`);
        }
    }
}
