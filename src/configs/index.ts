import type { ConfigModuleOptions } from '@nestjs/config';
import httpConfig from './http.config';

export const configModuleOptions: ConfigModuleOptions = {
	isGlobal: true,
	skipProcessEnv: true,
	ignoreEnvFile: true,
	load: [httpConfig],
};
