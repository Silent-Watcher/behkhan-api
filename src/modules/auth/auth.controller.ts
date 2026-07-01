import {
	Controller,
	forwardRef,
	Get,
	Inject,
	Post,
	Req,
	UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from './auth.service.js';
import { LocalAuthGuard } from './guards/local-auth.guard.js';

@Controller('auth')
export class AuthController {
	constructor(
		@Inject(forwardRef(() => AuthService))
		private readonly authService: AuthService,
	) {}

	@UseGuards(LocalAuthGuard)
	@Post('login')
	async login(@Req() req: Request) {
		return req.user;
	}

	@Get('logout')
	async logout(@Req() req: Request) {
		return req.logOut({}, () => {});
	}
}
