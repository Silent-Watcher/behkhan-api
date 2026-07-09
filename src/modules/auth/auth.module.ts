import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '#modules/user/user.entity.js';
import { UserModule } from '#modules/user/user.module.js';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { SessionSerializer } from './session.serializer.js';
import { LocalStrategy } from './strategies/local.strategy.js';
import { GoogleStrategy } from './strategies/google.strategy.js';

@Module({
	imports: [
		TypeOrmModule.forFeature([UserEntity]),
		UserModule,
		PassportModule,
	],
	controllers: [AuthController],
	providers: [AuthService, LocalStrategy, GoogleStrategy, SessionSerializer],
})
export class AuthModule {}
