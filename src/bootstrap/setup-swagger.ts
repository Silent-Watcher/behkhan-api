import type { INestApplication } from '@nestjs/common';
import {
	DocumentBuilder,
	type SwaggerCustomOptions,
	SwaggerModule,
} from '@nestjs/swagger';
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';
import { APP_NAME } from '#constants/app.js';
import { isProduction } from '#constants/environment.js';

export function setupSwagger(app: INestApplication): void {
	if (isProduction) return;

	const swaggerConfig = new DocumentBuilder()
		.setTitle(APP_NAME)
		.setDescription(`The ${APP_NAME}  description`)
		.setVersion('1.0')
		.build();

	const theme = new SwaggerTheme();
	const options: SwaggerCustomOptions = {
		explorer: true,
		customCss: theme.getBuffer(SwaggerThemeNameEnum.DARK),
		jsonDocumentUrl: 'swagger/json',
		useGlobalPrefix: true,
		swaggerOptions: {
			displayRequestDuration: true,
		},
		customSiteTitle: `${APP_NAME} docs`,
	};

	const documentFactory = () =>
		SwaggerModule.createDocument(app, swaggerConfig);

	SwaggerModule.setup('docs', app, documentFactory, options);
}
