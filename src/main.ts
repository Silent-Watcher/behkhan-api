import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Logger } from 'pino-nestjs';
import { AppModule } from './app.module.js';
import { setupStartupLogs } from './bootstrap/setup-startup-logs.js';
import { setupSwagger } from './bootstrap/setup-swagger.js';
import type { HttpConfig } from './configs/http.config.js';
import helmet from 'helmet';

async function bootstrap() {
	const app = await NestFactory.create(AppModule, { bufferLogs: true });

	const logger = app.get(Logger);

	setupStartupLogs(logger);

	app.useLogger(logger);
	app.use(helmet());

	app.setGlobalPrefix('api');

	const config = app.get(ConfigService);
	const { port, host } = config.get<HttpConfig>('http', { infer: true });

	setupSwagger(app);

	await app.listen(port, host, () => {});
}
bootstrap();
