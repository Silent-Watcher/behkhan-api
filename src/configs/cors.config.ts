import type { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface.js';
import { registerAs } from '@nestjs/config';
import { _1DAY_TO_SECONDS } from '#constants/time.js';
import _env from '../bootstrap/setup-env.js';

export default registerAs(
	'cors',
	(): CorsOptions =>
		Object.freeze({
			origin: _env.CORS_ORIGINS,
			credentials: true,
			maxAge: _1DAY_TO_SECONDS,
		} as const),
);
