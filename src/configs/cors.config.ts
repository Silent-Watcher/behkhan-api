import { registerAs } from '@nestjs/config';
import z from 'zod';
import { fromError } from 'zod-validation-error';
import { ENV_VALIDATION_FAILED_MESSAGE } from '#constants/message.js';
import type { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface.js';

export default registerAs('cors', (): CorsOptions => {
	const config: CorsOptions = {
		origin: process.env.CORS_ORIGINS?.split(','),
		credentials: true,
		maxAge: 86400, // 1 day in seconds
	};

	const OriginSchema = z
		.string()
		.nonempty()
		.transform((value) => value.split(',').map((origin) => origin.trim()))
		.pipe(
			z.array(
				z
					.url({
						protocol: /^https?$/,
					})
					.transform((origin) => origin.replace(/\/$/, '')),
			),
		);

	const parseResult = z.safeParse(OriginSchema, process.env.CORS_ORIGINS);

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

	return config;
});
