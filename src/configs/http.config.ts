import { registerAs } from '@nestjs/config';
import _env from '../bootstrap/setup-env.js';

export interface HttpConfig {
	host: string;
	port: number;
}

export default registerAs('http', (): HttpConfig => {
	const config = {
		host: _env.HTTP_HOST,
		port: _env.HTTP_PORT,
	};

	return config;
});
