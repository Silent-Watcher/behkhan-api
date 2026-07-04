import { registerAs } from '@nestjs/config';
import type { Params } from 'pino-nestjs';
import { APP_NAME } from '#constants/app.js';
import { isNonProduction } from '#constants/environment.js';

type PinoLoggerOptions = Params;

import _env from '../bootstrap/setup-env.js';
import { randomUUID } from 'node:crypto';

export default registerAs(
	'pino',
	(): PinoLoggerOptions =>
		Object.freeze({
			pinoHttp: {
				genReqId: () => randomUUID(),
				name: APP_NAME,
				level: _env.LOG_LEVEL,
				transport: isNonProduction
					? { target: 'pino-pretty' }
					: undefined,
			},
		} as const),
);
