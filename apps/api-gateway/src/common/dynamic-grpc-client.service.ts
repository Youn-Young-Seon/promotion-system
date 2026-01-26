import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ClientGrpc, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { EtcdService, ServiceInstance } from '@common/index';
import { join } from 'path';

@Injectable()
export class DynamicGrpcClientService implements OnModuleInit {
  private readonly logger = new Logger(DynamicGrpcClientService.name);
  private clients: Map<string, ClientGrpc> = new Map();
  private serviceEndpoints: Map<string, string> = new Map();

  constructor(private readonly etcdService: EtcdService) {}

  async onModuleInit(): Promise<void> {
    // 서비스 발견 및 gRPC 클라이언트 초기화
    await this.discoverAndConnectServices();

    // 서비스 변경 감시
    this.watchServices();
  }

  private async discoverAndConnectServices(): Promise<void> {
    const services = ['coupon-service', 'point-service', 'timesale-service'];

    for (const serviceName of services) {
      try {
        const instances = await this.etcdService.discoverService(serviceName);

        if (instances.length > 0 && instances[0]) {
          // 첫 번째 인스턴스 사용 (라운드 로빈은 추후 구현 가능)
          const instance = instances[0];
          await this.createGrpcClient(serviceName, instance);
        } else {
          this.logger.warn(`No instances found for service: ${serviceName}`);
        }
      } catch (error) {
        this.logger.error(`Failed to discover service: ${serviceName}`, error);
      }
    }
  }

  private async createGrpcClient(
    serviceName: string,
    instance: ServiceInstance,
  ): Promise<void> {
    const url = `${instance.host}:${instance.port}`;

    // 서비스 이름에서 패키지명 추출 (예: coupon-service -> coupon)
    const packageName = serviceName.replace('-service', '');
    const protoPath = join(__dirname, `../../../../proto/${packageName}.proto`);

    try {
      const client = ClientProxyFactory.create({
        transport: Transport.GRPC,
        options: {
          package: packageName,
          protoPath,
          url,
          loader: {
            keepCase: true,
            longs: String,
            enums: String,
            defaults: true,
            oneofs: true,
          },
        },
      }) as ClientGrpc;

      // gRPC 클라이언트는 lazy connection을 사용하므로 connect() 호출 불필요
      this.clients.set(serviceName, client);
      this.serviceEndpoints.set(serviceName, url);

      this.logger.log(`Connected to ${serviceName} at ${url}`);
    } catch (error) {
      this.logger.error(`Failed to connect to ${serviceName} at ${url}`, error);
    }
  }

  private watchServices(): void {
    const services = ['coupon-service', 'point-service', 'timesale-service'];

    for (const serviceName of services) {
      void this.etcdService.watchService(serviceName, async (instances) => {
        this.logger.log(`Service ${serviceName} instances changed: ${instances.length} instances`);

        if (instances.length > 0 && instances[0]) {
          const instance = instances[0];
          const newUrl = `${instance.host}:${instance.port}`;
          const currentUrl = this.serviceEndpoints.get(serviceName);

          // URL이 변경된 경우에만 재연결
          if (newUrl !== currentUrl) {
            this.logger.log(`Reconnecting to ${serviceName} at ${newUrl}`);

            // 기존 클라이언트 제거 (gRPC 클라이언트는 자동으로 정리됨)
            this.clients.delete(serviceName);

            // 새 클라이언트 생성
            await this.createGrpcClient(serviceName, instance);
          }
        }
      });
    }
  }

  getClient(serviceName: string): ClientGrpc {
    const client = this.clients.get(serviceName);

    if (!client) {
      throw new Error(`gRPC client not found for service: ${serviceName}`);
    }

    return client;
  }

  getCouponClient(): ClientGrpc {
    return this.getClient('coupon-service');
  }

  getPointClient(): ClientGrpc {
    return this.getClient('point-service');
  }

  getTimeSaleClient(): ClientGrpc {
    return this.getClient('timesale-service');
  }
}
