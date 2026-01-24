import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Etcd3 } from 'etcd3';

export interface ServiceInstance {
  host: string;
  port: number;
  protocol: string;
}

@Injectable()
export class EtcdService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(EtcdService.name);
  private client!: Etcd3;
  private leaseId: string | null = null;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit(): Promise<void> {
    const hosts = this.configService
      .get<string>('ETCD_HOSTS', 'localhost:2379')
      .split(',');

    this.client = new Etcd3({
      hosts,
    });

    this.logger.log('etcd client initialized successfully');
  }

  async onModuleDestroy(): Promise<void> {
    if (this.leaseId) {
      await this.client.lease(this.leaseId).revoke();
    }
    this.logger.log('etcd client closed');
  }

  async registerService(
    serviceName: string,
    instance: ServiceInstance,
    ttl = 10,
  ): Promise<void> {
    try {
      const lease = this.client.lease(ttl);
      this.leaseId = await lease.grant();

      const key = `/services/${serviceName}/${instance.host}:${instance.port}`;
      const value = JSON.stringify(instance);

      await this.client.put(key).value(value).lease(this.leaseId).exec();

      // Keep-alive for the lease
      lease.on('lost', () => {
        this.logger.warn(`Lease lost for service ${serviceName}, re-registering...`);
        void this.registerService(serviceName, instance, ttl);
      });

      this.logger.log(`Service registered: ${serviceName} at ${instance.host}:${instance.port}`);
    } catch (error: unknown) {
      this.logger.error(`Failed to register service ${serviceName}`, error);
      throw error;
    }
  }

  async discoverService(serviceName: string): Promise<ServiceInstance[]> {
    try {
      const prefix = `/services/${serviceName}/`;
      const services = await this.client.getAll().prefix(prefix).strings();

      return Object.values(services).map((value) => JSON.parse(value) as ServiceInstance);
    } catch (error: unknown) {
      this.logger.error(`Failed to discover service ${serviceName}`, error);
      throw error;
    }
  }

  async watchService(
    serviceName: string,
    callback: (instances: ServiceInstance[]) => void,
  ): Promise<void> {
    const prefix = `/services/${serviceName}/`;
    const watcher = await this.client.watch().prefix(prefix).create();

    watcher.on('put', async () => {
      const instances = await this.discoverService(serviceName);
      callback(instances);
    });

    watcher.on('delete', async () => {
      const instances = await this.discoverService(serviceName);
      callback(instances);
    });

    this.logger.log(`Watching service: ${serviceName}`);
  }
}
