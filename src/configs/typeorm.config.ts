import { registerAs } from '@nestjs/config';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import z from 'zod';
import { fromError } from 'zod-validation-error';
import { ENV_VALIDATION_FAILED_MESSAGE } from '#constants/message.js';
import { isDevelopment } from '#constants/environment.js';
import { APP_NAME } from '#constants/app.js';

const dbConfigSchema = z
	.object({
		host: z.string().trim().min(1, 'DB_HOST is required'),
		port: z.coerce
			.number()
			.int('DB_PORT must be an integer')
			.min(1, 'DB_PORT must be between 1 and 65535')
			.max(65535, 'DB_PORT must be between 1 and 65535'),
		username: z.string().trim().min(1, 'DB_USERNAME is required'),
		password: z.string().min(1, 'DB_PASSWORD is required'),
		database: z.string().trim().min(1, 'DB_NAME is required'),
	})
	.loose();

export default registerAs('typeorm', (): TypeOrmModuleOptions => {
	const config: TypeOrmModuleOptions = Object.freeze({
        type: 'postgres',
		port: +(process.env?.DB_PORT as string),
		host: process.env?.DB_HOST,
		username: process.env?.DB_USERNAME,
		password: process.env?.DB_PASSWORD,
		database: process.env?.DB_NAME,
		synchronize: isDevelopment,
		autoLoadEntities: true,
		applicationName: APP_NAME,
		migrationsRun: false,
	} as const);

	const parseResult = dbConfigSchema.safeParse(config);

	if (!parseResult.success) {
		throw new Error(
			ENV_VALIDATION_FAILED_MESSAGE(
				fromError(parseResult.error).toString(),
			),
			{
				cause: parseResult.error,
			},
		);
	}

	return parseResult.data;
});
