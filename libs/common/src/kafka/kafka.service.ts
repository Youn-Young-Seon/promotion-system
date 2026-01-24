import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Producer, Consumer, EachMessagePayload } from 'kafkajs';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaService.name);
  private kafka!: Kafka;
  private producer!: Producer;
  private consumers: Map<string, Consumer> = new Map();

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit(): Promise<void> {
    const brokers = this.configService
      .get<string>('KAFKA_BROKERS', 'localhost:9092')
      .split(',');

    this.kafka = new Kafka({
      clientId: this.configService.get<string>('KAFKA_CLIENT_ID', 'promotion-system'),
      brokers,
      retry: {
        initialRetryTime: 100,
        retries: 8,
      },
    });

    this.producer = this.kafka.producer();
    await this.producer.connect();
    this.logger.log('Kafka producer connected successfully');
  }

  async onModuleDestroy(): Promise<void> {
    await this.producer.disconnect();

    for (const [groupId, consumer] of this.consumers.entries()) {
      await consumer.disconnect();
      this.logger.log(`Kafka consumer disconnected: ${groupId}`);
    }

    this.logger.log('Kafka connections closed');
  }

  async emit(topic: string, message: Record<string, unknown>): Promise<void> {
    try {
      await this.producer.send({
        topic,
        messages: [
          {
            key: String(message.id ?? Date.now()),
            value: JSON.stringify(message),
            timestamp: String(Date.now()),
          },
        ],
      });
      this.logger.debug(`Message sent to topic ${topic}`, { message });
    } catch (error: unknown) {
      this.logger.error(`Failed to send message to topic ${topic}`, error);
      throw error;
    }
  }

  async subscribe(
    topic: string,
    groupId: string,
    handler: (payload: EachMessagePayload) => Promise<void>,
  ): Promise<void> {
    const consumer = this.kafka.consumer({ groupId });
    await consumer.connect();
    await consumer.subscribe({ topic, fromBeginning: false });

    await consumer.run({
      eachMessage: async (payload: EachMessagePayload) => {
        try {
          await handler(payload);
        } catch (error: unknown) {
          this.logger.error(`Error processing message from topic ${topic}`, error);
        }
      },
    });

    this.consumers.set(groupId, consumer);
    this.logger.log(`Kafka consumer subscribed to topic ${topic} with group ${groupId}`);
  }
}
