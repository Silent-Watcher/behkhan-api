import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'pino-nestjs';
import { AppController } from './app.controller.js';
import adminPanelConfig from './configs/admin-panel.config.js';
import { configModuleOptions } from './configs/index.js';
import pinoConfig from './configs/pino.config.js';
import typeormConfig from './configs/typeorm.config.js';

@Module({
	imports: [
		ConfigModule.forRoot(configModuleOptions),
		LoggerModule.forRootAsync(pinoConfig.asProvider()),
		import('@adminjs/nestjs').then(({ AdminModule }) =>
			AdminModule.createAdminAsync(adminPanelConfig.asProvider()),
		),
		TypeOrmModule.forRootAsync(typeormConfig.asProvider()),
	],
	controllers: [AppController],
	providers: [],
})
export class AppModule {}
