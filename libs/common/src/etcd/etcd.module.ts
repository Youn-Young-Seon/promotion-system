import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EtcdService } from './etcd.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [EtcdService],
  exports: [EtcdService],
})
export class EtcdModule {}
