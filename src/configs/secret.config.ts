import { registerAs } from '@nestjs/config';
import _env from '../bootstrap/setup-env.js';

export interface SecretConfig {
	session: string;
}

export default registerAs(
	'secret',
	(): SecretConfig =>
		Object.freeze({
			session: _env.SESSION_SECRET,
		} as const),
);
