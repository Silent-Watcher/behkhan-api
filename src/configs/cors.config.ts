import type { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface.js';
import { registerAs } from '@nestjs/config';
import _env from '../bootstrap/setup-env.js';

export default registerAs('cors', (): CorsOptions => {
	const config: CorsOptions = Object.freeze({
		origin: _env.CORS_ORIGINS,
		credentials: true,
		maxAge: 86400, // 1 day in seconds
	} as const);

	return config;
});
