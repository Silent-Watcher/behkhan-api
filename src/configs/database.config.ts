import { registerAs } from '@nestjs/config';
import _env from '../bootstrap/setup-env.js';

export interface DatabaseConfig {
	port: number;
	host: string;
	username: string;
	password: string;
	database: string;
}

export default registerAs(
	'database',
	(): DatabaseConfig =>
		Object.freeze({
			port: _env.DB_PORT,
			host: _env.DB_HOST,
			username: _env.DB_USERNAME,
			password: _env.DB_PASSWORD,
			database: _env.DB_NAME,
		} as const),
);
