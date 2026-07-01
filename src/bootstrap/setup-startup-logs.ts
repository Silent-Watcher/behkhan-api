import type { Logger } from 'pino-nestjs';
import { nodeEnv } from '#constants/environment.js';
import _env from './setup-env.js';

export function setupStartupLogs(logger: Logger) {
	logger.log(`Environment: ${nodeEnv}`);
	logger.log(`Log level: ${_env.LOG_LEVEL}`);
}
