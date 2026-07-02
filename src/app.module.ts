import { Module } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'pino-nestjs';
import { isDevelopment } from '#constants/environment.js';
import { AuthModule } from '#modules/auth/auth.module.js';
import { UserEntity } from '#modules/user/user.entity.js';
import { UserModule } from '#modules/user/user.module.js';
import { AppController } from './app.controller.js';
import { ProtectedGuard } from './common/guards/protected.guard.js';
import adminPanelConfig from './configs/admin-panel.config.js';
import databaseConfig from './configs/database.config.js';
import { configModuleOptions } from './configs/index.js';
import pinoConfig from './configs/pino.config.js';
import { BlockAuthenticated } from './common/guards/block-authenticated.guard.js';

@Module({
	imports: [
		ConfigModule.forRoot(configModuleOptions),
		LoggerModule.forRootAsync(pinoConfig.asProvider()),
		import('@adminjs/nestjs').then(({ AdminModule }) =>
			AdminModule.createAdminAsync(adminPanelConfig.asProvider()),
		),
		TypeOrmModule.forRootAsync({
			useFactory(databaseConf: ConfigType<typeof databaseConfig>) {
				return {
					type: 'postgres',
					...databaseConf,
					autoLoadEntities: true,
					synchronize: isDevelopment,
					logging: isDevelopment,
					maxQueryExecutionTime: 1000,
					entities: [UserEntity],
				};
			},
			inject: [databaseConfig.KEY],
		}),
		UserModule,
		AuthModule,
	],
	controllers: [AppController],
	providers: [
		{
			provide: APP_GUARD,
			useClass: ProtectedGuard,
		},
		{
			provide: APP_GUARD,
			useClass: BlockAuthenticated,
		},
	],
})
export class AppModule {}
