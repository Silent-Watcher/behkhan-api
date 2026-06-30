import type { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface.js';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { Logger } from 'pino-nestjs';
import { AppModule } from './app.module.js';
import { setupCors } from './bootstrap/setup-cors.js';
import { setupEnv } from './bootstrap/setup-env.js';
import { setupStartupLogs } from './bootstrap/setup-startup-logs.js';
import { setupSwagger } from './bootstrap/setup-swagger.js';
import type { HttpConfig } from './configs/http.config.js';

async function bootstrap() {
	setupEnv();
	const app = await NestFactory.create(AppModule, { bufferLogs: true });

	const logger = app.get(Logger);

	setupStartupLogs(logger);

	app.useLogger(logger);
	app.use(helmet());

	app.setGlobalPrefix('api');

	const config = app.get(ConfigService);
	const { origin, credentials, maxAge } = config.get<CorsOptions>('cors', {
		infer: true,
	});
	const { port, host } = config.get<HttpConfig>('http', { infer: true });

	const allowedOrigins: Set<string> = new Set(origin);

	setupCors(app, allowedOrigins, { credentials, maxAge });
	setupSwagger(app);

	await app.listen(port, host, () => {});
}
bootstrap();
