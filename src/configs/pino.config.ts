import { registerAs } from '@nestjs/config';
import type { Params } from 'pino-nestjs';
import { APP_NAME } from '#constants/app.js';
import { isNonProduction } from '#constants/environment.js';

type PinoLoggerOptions = Params;

import _env from '../bootstrap/setup-env.js';

export default registerAs('pino', (): PinoLoggerOptions => {
	const config: PinoLoggerOptions = {
		pinoHttp: {
			name: APP_NAME,
			level: _env.LOG_LEVEL,
			transport: isNonProduction ? { target: 'pino-pretty' } : undefined,
		},
	};

	return config;
});
