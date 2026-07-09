import { Module } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'pino-nestjs';
import { isDevelopment } from '#constants/environment.js';
import { GuestOnlyGuard } from '#guards/guest-only.guard.js';
import { ProtectedGuard } from '#guards/protected.guard.js';
import { AchievementEntity } from '#modules/achievement/achievement.entity.js';
import { AchievementModule } from '#modules/achievement/achievement.module.js';
import { AuthModule } from '#modules/auth/auth.module.js';
import { ExternalIdentityEntity } from '#modules/auth/external-identity.entity.js';
import { SessionEntitiy } from '#modules/session/session.entity.js';
import { UserEntity } from '#modules/user/user.entity.js';
import { UserModule } from '#modules/user/user.module.js';
import { UtilModule } from '#modules/util/util.module.js';
import { AppController } from './app.controller.js';
import { HttpExceptionFilter } from './common/filters/http-exception.filter.js';
import { ResponseInterceptor } from './common/interceptors/response.interceptor.js';
import adminPanelConfig from './configs/admin-panel.config.js';
import databaseConfig from './configs/database.config.js';
import { configModuleOptions } from './configs/index.js';
import pinoConfig from './configs/pino.config.js';

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
					entities: [
						UserEntity,
						SessionEntitiy,
						AchievementEntity,
						ExternalIdentityEntity,
					],
				};
			},
			inject: [databaseConfig.KEY],
		}),
		UserModule,
		AuthModule,
		AchievementModule,
		UtilModule,
	],
	controllers: [AppController],
	providers: [
		{
			provide: APP_GUARD,
			useClass: ProtectedGuard,
		},
		{
			provide: APP_GUARD,
			useClass: GuestOnlyGuard,
		},
		{
			provide: APP_FILTER,
			useClass: HttpExceptionFilter,
		},
		{
			provide: APP_INTERCEPTOR,
			useClass: ResponseInterceptor,
		},
	],
})
export class AppModule {}
