import { ValidationPipe } from '@nestjs/common';
import type { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface.js';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { Logger } from 'pino-nestjs';
import { setupCookieParser } from '#bootstrap/setup-cookie-parser.js';
import { setupCsrf } from '#bootstrap/setup-csrf.js';
import { setupPassport } from '#bootstrap/setup-passport.js';
import { setupVersioning } from '#bootstrap/setup-versioning.js';
import { API_GLOBAL_PREFIX } from '#constants/app.js';
import { AppModule } from './app.module.js';
import { setupCors } from './bootstrap/setup-cors.js';
import { setupEnv } from './bootstrap/setup-env.js';
import { setupSession } from './bootstrap/setup-session.js';
import { setupStartupLogs } from './bootstrap/setup-startup-logs.js';
import { setupSwagger } from './bootstrap/setup-swagger.js';
import type { HttpConfig } from './configs/http.config.js';

async function bootstrap() {
	setupEnv();
	const app = await NestFactory.create(AppModule, { bufferLogs: true });
	const config = app.get(ConfigService);
	const { origin, credentials, maxAge } = config.get<CorsOptions>('cors', {
		infer: true,
	});
	const { port, host } = config.get<HttpConfig>('http', { infer: true });
	const { csrf, session } = config.get('secret', { infer: true });
	const allowedOrigins: Set<string> = new Set(origin);

	const logger = app.get(Logger);

	app.use(helmet());
	// setupVersioning(app);

	setupStartupLogs(logger);
	setupCookieParser(app);
	setupSession(app, session);
	setupCsrf(app, csrf);

	app.useLogger(logger);
	app.setGlobalPrefix(API_GLOBAL_PREFIX);

	setupCors(app, allowedOrigins, { credentials, maxAge });
	setupSwagger(app);

	app.useGlobalPipes(new ValidationPipe({}));

	setupPassport(app);

	await app.listen(port, host, () => {});
}
bootstrap();
