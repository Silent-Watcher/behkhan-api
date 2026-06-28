import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'pino-nestjs';
import { configModuleOptions } from './configs';
import pinoConfig from './configs/pino.config';

@Module({
	imports: [
		ConfigModule.forRoot(configModuleOptions),
		LoggerModule.forRootAsync(pinoConfig.asProvider()),
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
