import * as winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const { combine, timestamp, printf, colorize, errors, json } = winston.format;

// 커스텀 로그 포맷 (개발 환경)
const devFormat = printf((info) => {
  const { level, message, timestamp, requestId, service, context, stack, ...meta } = info;

  // 문자열로 변환 (Symbol iterator 제거)
  const messageStr = typeof message === 'string' ? message :
                     typeof message === 'object' && message !== null ? JSON.stringify(message) :
                     String(message);

  const requestIdStr = requestId ? `[${requestId}]` : '';
  const serviceStr = service ? `[${service}]` : '';
  const contextStr = context ? ` ${context}` : '';

  // 중요한 메타데이터만 표시 (한 줄로)
  const filteredMeta = Object.fromEntries(
    Object.entries(meta).filter(([key, value]) =>
      // Symbol 속성과 내부 속성 제거
      typeof key === 'string' && !key.match(/^\d+$/) && value !== undefined
    )
  );
  const metaStr = Object.keys(filteredMeta).length > 0 ? ` ${JSON.stringify(filteredMeta)}` : '';

  // 스택 트레이스는 다음 줄에
  const stackStr = stack ? `\n${stack}` : '';

  return `${timestamp} ${level} ${serviceStr}${requestIdStr}${contextStr}: ${messageStr}${metaStr}${stackStr}`;
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
    level: process.env['LOG_LEVEL'] || 'info', // info for both dev and prod
    format: combine(
      timestamp(),
      errors({ stack: true }),
      winston.format((info) => {
        info['service'] = serviceName;

        // 불필요한 NestJS 내부 로그 필터링 (개발 환경)
        if (isDev && typeof info.message === 'string') {
          const message = info.message as string;
          const skipPatterns = [
            /dependencies initialized$/,
            /^Nest application successfully started$/,
            /^Mapped \{/,
            /^\[Nest\]/,
          ];

          if (skipPatterns.some(pattern => pattern.test(message))) {
            info.level = 'debug'; // debug로 낮춰서 기본적으로 숨김
          }
        }

        return info;
      })()
    ),
    transports,
    exceptionHandlers: isDev ? undefined : [
      new winston.transports.File({
        filename: `logs/${serviceName}/exceptions.log`,
      }),
    ],
    rejectionHandlers: isDev ? undefined : [
      new winston.transports.File({
        filename: `logs/${serviceName}/rejections.log`,
      }),
    ],
  };
};
