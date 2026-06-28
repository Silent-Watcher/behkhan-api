import { registerAs } from '@nestjs/config';
import z from 'zod';
import { fromError } from 'zod-validation-error';
import { ENV_VALIDATION_FAILED_MESSAGE } from '#constants/message.js';

export interface CorsConfig {
	/**
	 * Configures the Access-Control-Allow-Origin CORS header.
	 */
	origin?:
		| boolean
		| string
		| RegExp
		| Array<string | RegExp>
		| ((
				origin: string | undefined,
				callback: (
					err: Error | null,
					allow?: boolean | string | RegExp | Array<string | RegExp>,
				) => void,
		  ) => void);

	/**
	 * Configures the Access-Control-Allow-Methods CORS header.
	 */
	methods?: string | string[];

	/**
	 * Configures the Access-Control-Allow-Headers CORS header.
	 */
	allowedHeaders?: string | string[];

	/**
	 * Configures the Access-Control-Expose-Headers CORS header.
	 */
	exposedHeaders?: string | string[];

	/**
	 * Configures the Access-Control-Allow-Credentials CORS header.
	 */
	credentials?: boolean;

	/**
	 * Configures the Access-Control-Max-Age CORS header.
	 */
	maxAge?: number;

	/**
	 * Passes the CORS preflight response to the next handler.
	 */
	preflightContinue?: boolean;

	/**
	 * Provides a status code to use for successful OPTIONS requests.
	 * Useful for legacy browsers (IE11, some SmartTVs).
	 *
	 * @default 204
	 */
	optionsSuccessStatus?: number;
}

export default registerAs('cors', (): CorsConfig => {
	const config: CorsConfig = {
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
