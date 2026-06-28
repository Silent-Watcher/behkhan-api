import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import type { HttpConfig } from './configs/http.config';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	const config = app.get(ConfigService);
	const { port, host } = config.get<HttpConfig>('http', { infer: true });

	await app.listen(port, host);
}
bootstrap();
