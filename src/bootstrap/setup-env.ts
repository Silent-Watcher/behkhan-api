import type { z } from 'zod';
import { fromError } from 'zod-validation-error';
import { envSchema } from '../validation/schemas/env.js';

export type Env = z.infer<typeof envSchema>;

export function setupEnv(schema = envSchema): Env {
	const parseResult = schema.safeParse(process.env);

	if (!parseResult.success) {
		throw new Error(
			`Environment validation failed \n One or more required environment variables are missing or contain invalid values. \n Please review the errors below, update your environment configuration, and restart the application. \n ${fromError(parseResult.error).toString()}`,
			{ cause: parseResult.error },
		);
	}

	return parseResult.data;
}

const _env = setupEnv(envSchema);
export default _env;
