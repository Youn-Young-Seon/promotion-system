import { Logger } from '@nestjs/common';

/**
 * Decorator to log method execution time and parameters
 * Usage: @LogExecution() above any method
 */
export function LogExecution() {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor,
    ) {
        const originalMethod = descriptor.value;
        const logger = new Logger(target.constructor.name);

        descriptor.value = async function (...args: any[]) {
            const startTime = Date.now();
            logger.log(`Executing ${propertyKey}...`);

            try {
                const result = await originalMethod.apply(this, args);
                const executionTime = Date.now() - startTime;
                logger.log(
                    `${propertyKey} completed successfully in ${executionTime}ms`,
                );
                return result;
            } catch (error) {
                const executionTime = Date.now() - startTime;
                logger.error(
                    `${propertyKey} failed after ${executionTime}ms: ${error.message}`,
                    error.stack,
                );
                throw error;
            }
        };

        return descriptor;
    };
}
