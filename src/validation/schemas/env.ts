import { isIP } from 'node:net';
import z from 'zod';

export const envSchema = z.object({
	APP_ENV: z.enum(['development', 'staging', 'production', 'test']),
	NODE_ENV: z.enum(['development', 'production', 'test']),
	HTTP_HOST: z
		.string({
			error: 'HOST is required.',
		})
		.trim()
		.min(1, 'HOST cannot be empty.')
		.refine((host) => {
			if (host === 'localhost') return true;

			if (isIP(host) !== 0) return true;

			try {
				new URL(`http://${host}`);
				return true;
			} catch {
				return false;
			}
		}, 'HOST must be a valid hostname or IP address.'),
	HTTP_PORT: z.coerce.number().int().min(1).max(65_535),
	LOG_LEVEL: z.enum([
		'fatal',
		'error',
		'warn',
		'info',
		'debug',
		'trace',
		'silent',
	]),
	CORS_ORIGINS: z.preprocess(
		(value) =>
			typeof value === 'string'
				? value
						.split(',')
						.map((origin) => origin.trim().replace(/\/$/, ''))
						.filter(Boolean)
				: value,
		z.array(
			z.url({
				protocol: /^https?$/,
			}),
		),
	),
	DB_HOST: z.string().trim().min(1, 'DB_HOST is required'),
	DB_PORT: z.coerce
		.number()
		.int('DB_PORT must be an integer')
		.min(1, 'DB_PORT must be between 1 and 65535')
		.max(65535, 'DB_PORT must be between 1 and 65535'),
	DB_USERNAME: z.string().trim().min(1, 'DB_USERNAME is required'),
	DB_PASSWORD: z.string().min(1, 'DB_PASSWORD is required'),
	DB_NAME: z.string().trim().min(1, 'DB_NAME is required'),
	SESSION_SECRET: z.string().trim().min(1, 'SESSION_SECRET  required'),
});
