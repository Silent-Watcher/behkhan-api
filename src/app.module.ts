import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'pino-nestjs';
import { configModuleOptions } from './configs/index.js';
import adminPanelConfig from './configs/admin-panel.config.js';
import pinoConfig from './configs/pino.config.js';

@Module({
	imports: [
		ConfigModule.forRoot(configModuleOptions),
		LoggerModule.forRootAsync(pinoConfig.asProvider()),
		import('@adminjs/nestjs').then(({ AdminModule }) =>
			AdminModule.createAdminAsync(adminPanelConfig.asProvider()),
		),
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
