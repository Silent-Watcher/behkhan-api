import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Logger } from 'pino-nestjs';
import { AppModule } from './app.module.js';
import type { HttpConfig } from './configs/http.config.js';

async function bootstrap() {
	const app = await NestFactory.create(AppModule, { bufferLogs: true });

	app.useLogger(app.get(Logger));

	const config = app.get(ConfigService);
	const { port, host } = config.get<HttpConfig>('http', { infer: true });

	await app.listen(port, host);
}
bootstrap();
