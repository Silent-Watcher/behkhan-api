import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { APP_NAME } from '#constants/app.js';
import { isProduction } from '#constants/environment.js';

export function setupSwagger(app: INestApplication): void {
	if (isProduction) return;

	const swaggerConfig = new DocumentBuilder()
		.setTitle(APP_NAME)
		.setDescription(`The ${APP_NAME}  description`)
		.setVersion('1.0')
		.build();
	const documentFactory = () =>
		SwaggerModule.createDocument(app, swaggerConfig);
	SwaggerModule.setup('api-docs', app, documentFactory, {
		jsonDocumentUrl: 'swagger/json',
	});
}
