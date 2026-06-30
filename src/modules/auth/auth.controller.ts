import {
	Controller,
	forwardRef,
	Inject,
	Post,
	Req,
	UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service.js';
import type { Request } from 'express';
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
}
