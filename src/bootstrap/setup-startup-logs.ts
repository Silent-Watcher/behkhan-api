import type { Logger } from 'pino-nestjs';
import { nodeEnv } from '#constants/environment.js';

export function setupStartupLogs(logger: Logger) {
	logger.log(`Environment: ${nodeEnv}`);
	logger.log(`Log level: ${process.env.LOG_LEVEL}`);
}
