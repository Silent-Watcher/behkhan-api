import { registerAs } from '@nestjs/config';
import type { Params } from 'pino-nestjs';
import z from 'zod';
import { APP_NAME } from '../common/constants/app.js';
import { isNonProduction } from '../common/constants/environment.js';

interface PinoLoggerOptions extends Params {}

import type { LevelWithSilent } from 'pino';
import { fromError } from 'zod-validation-error';
import { ENV_VALIDATION_FAILED_MESSAGE } from '../common/constants/message.js';

export const LOG_LEVELS = [
	'fatal',
	'error',
	'warn',
	'info',
	'debug',
	'trace',
	'silent',
] as const satisfies readonly LevelWithSilent[];

export default registerAs('pino', (): PinoLoggerOptions => {
	const logLevel = process.env?.LOG_LEVEL;
	const config: PinoLoggerOptions = {
		pinoHttp: {
			name: APP_NAME,
			level: logLevel,
			transport: isNonProduction ? { target: 'pino-pretty' } : undefined,
		},
	};

	const parseResult = z.safeParse(z.enum(LOG_LEVELS), logLevel);

	if (!parseResult.success) {
		throw new Error(
			ENV_VALIDATION_FAILED_MESSAGE(
				fromError(parseResult.error).toString(),
			),
			{
				cause: parseResult.error,
			},
		);
	}

	return config;
});
