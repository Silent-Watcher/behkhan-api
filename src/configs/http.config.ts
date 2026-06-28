import { isIP } from 'node:net';
import { registerAs } from '@nestjs/config';
import z from 'zod';
import { fromError } from 'zod-validation-error';
import { ENV_VALIDATION_FAILED_MESSAGE } from '#constants/message.js';

export interface HttpConfig {
	host: string;
	port: number;
}

const httpConfigSchema = z.object({
	host: z
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

	port: z.coerce
		.number({
			error: 'PORT must be a number.',
		})
		.int('PORT must be an integer.')
		.min(1, 'PORT must be between 1 and 65535.')
		.max(65_535, 'PORT must be between 1 and 65535.'),
});

export default registerAs('http', (): HttpConfig => {
	const config = {
		host: process.env?.HTTP_HOST,
		port: process.env?.HTTP_PORT,
	};

	const parseResult = httpConfigSchema.safeParse(config);

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
