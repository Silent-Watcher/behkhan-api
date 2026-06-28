import type { INestApplication } from '@nestjs/common';
import type { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface.js';

export function setupCors(
	app: INestApplication,
	allowedOrigins: Set<string>,
	CorsOptions: Omit<CorsOptions, 'origin'>,
) {
	app.enableCors({
		origin: (origin: string, callback) => {
			// Non-browser clients (curl, Postman, server-to-server, health checks)
			if (origin === undefined) {
				return callback(null, true);
			}

			// Allowed browser origin
			if (allowedOrigins.has(origin)) {
				return callback(null, true);
			}

			// Browser origin is not in the whitelist
			return callback(
				new Error(`Origin '${origin}' is not allowed by CORS`),
			);
		},
		...CorsOptions,
	});
}
