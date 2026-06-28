import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { Logger } from 'pino-nestjs';
import { AppModule } from './app.module.js';
import { setupStartupLogs } from './bootstrap/setup-startup-logs.js';
import { setupSwagger } from './bootstrap/setup-swagger.js';
import type { HttpConfig } from './configs/http.config.js';
import type { CorsConfig } from './configs/cors.config.js';

async function bootstrap() {
	const app = await NestFactory.create(AppModule, { bufferLogs: true });

	const logger = app.get(Logger);

	setupStartupLogs(logger);

	app.useLogger(logger);
	app.use(helmet());

	app.setGlobalPrefix('api');

	const config = app.get(ConfigService);
	const { origin, credentials, maxAge } = config.get<CorsConfig>('cors', {
		infer: true,
	});
	const { port, host } = config.get<HttpConfig>('http', { infer: true });

	const allowedOrigins = new Set(origin);

	app.enableCors({
		origin: (origin, callback) => {
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
		credentials,
		maxAge,
	});

	setupSwagger(app);

	await app.listen(port, host, () => {});
}
bootstrap();
