import type { ConfigModuleOptions } from '@nestjs/config';
import adminPanelConfig from './admin-panel.config.js';
import corsConfig from './cors.config.js';
import databaseConfig from './database.config.js';
import httpConfig from './http.config.js';
import pinoConfig from './pino.config.js';

export const configModuleOptions: ConfigModuleOptions = {
	isGlobal: true,
	skipProcessEnv: true,
	ignoreEnvFile: true,
	load: [
		httpConfig,
		pinoConfig,
		adminPanelConfig,
		corsConfig,
		databaseConfig,
	],
};
