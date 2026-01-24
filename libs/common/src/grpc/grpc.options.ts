import { Transport, GrpcOptions } from '@nestjs/microservices';
import { join } from 'path';

export function getGrpcOptions(
  packageName: string,
  protoFileName: string,
  url: string,
): GrpcOptions {
  return {
    transport: Transport.GRPC,
    options: {
      package: packageName,
      protoPath: join(__dirname, `../../../proto/${protoFileName}`),
      url,
      loader: {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
      },
    },
  };
}
