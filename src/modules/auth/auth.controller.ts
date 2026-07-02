import { promisify } from 'node:util';
import {
	Body,
	Controller,
	forwardRef,
	Inject,
	Post,
	Req,
	UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { BlockIfAuthenticated } from '#decorators/block-if-authenticated.decorator.js';
import { Public } from '#decorators/public.decorator.js';
import { AuthService } from './auth.service.js';
// biome-ignore lint/style/useImportType: <we need to emit some metadata for our dto>
import { SignupDto } from './dtos/signup.dto.js';
import { LocalAuthGuard } from './guards/local-auth.guard.js';

@Controller('auth')
export class AuthController {
	constructor(
		@Inject(forwardRef(() => AuthService))
		private readonly authService: AuthService,
	) {}

	@Public()
	@BlockIfAuthenticated()
	@Post('signup')
	async signup(@Body() signupDto: SignupDto, @Req() req: Request) {
		const user = await this.authService.signup(signupDto);

		const login = promisify(req.login.bind(req));
		await login(user);

		// TODO: set Location response header
		return { data: user, message: 'Successfull!' };
	}

	@Public()
	@BlockIfAuthenticated()
	@UseGuards(LocalAuthGuard)
	@Post('signin')
	signin(@Req() req: Request) {
		return { data: req.user, message: 'Successfull!' };
	}

	// TODO: add block if authenticated guard
	@Post('/logout')
	async logout(@Req() req: Request) {
		const logout = promisify(req.logout.bind(req));
		await logout();

		return { message: 'Successfull' };
	}
}
