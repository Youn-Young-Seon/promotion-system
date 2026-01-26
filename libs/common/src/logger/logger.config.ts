import * as winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const { combine, timestamp, printf, colorize, errors, json } = winston.format;

interface LogInfo {
  level: string;
  message: string;
  timestamp?: string;
  requestId?: string;
  service?: string;
  [key: string]: unknown;
}

// 커스텀 로그 포맷 (개발 환경)
const devFormat = printf((info: LogInfo) => {
  const { level, message, timestamp, requestId, service, ...meta } = info;
  const requestIdStr = requestId ? `[${requestId}]` : '';
  const serviceStr = service ? `[${service}]` : '';
  const metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';

  return `${timestamp} ${level} ${serviceStr}${requestIdStr}: ${message} ${metaStr}`;
});

// 프로덕션 로그 포맷 (JSON)
const prodFormat = combine(
  errors({ stack: true }),
  timestamp(),
  json()
);

export const createLoggerConfig = (serviceName: string) => {
  const isDev = process.env['NODE_ENV'] !== 'production';

  const transports: winston.transport[] = [
    // 콘솔 출력
    new winston.transports.Console({
      format: isDev
        ? combine(
            colorize(),
            timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            devFormat
          )
        : prodFormat,
    }),
  ];

  // 프로덕션 환경에서는 파일로도 저장
  if (!isDev) {
    // 모든 로그
    transports.push(
      new DailyRotateFile({
        dirname: `logs/${serviceName}`,
        filename: 'application-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        maxSize: '20m',
        maxFiles: '14d',
        format: prodFormat,
      })
    );

    // 에러 로그만 별도 저장
    transports.push(
      new DailyRotateFile({
        dirname: `logs/${serviceName}`,
        filename: 'error-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        maxSize: '20m',
        maxFiles: '14d',
        level: 'error',
        format: prodFormat,
      })
    );
  }

  return {
    level: process.env['LOG_LEVEL'] || (isDev ? 'debug' : 'info'),
    format: combine(
      timestamp(),
      errors({ stack: true }),
      winston.format((info: LogInfo) => {
        info['service'] = serviceName;
        return info;
      })()
    ),
    transports,
    exceptionHandlers: [
      new winston.transports.File({
        filename: `logs/${serviceName}/exceptions.log`,
      }),
    ],
    rejectionHandlers: [
      new winston.transports.File({
        filename: `logs/${serviceName}/rejections.log`,
      }),
    ],
  };
};
