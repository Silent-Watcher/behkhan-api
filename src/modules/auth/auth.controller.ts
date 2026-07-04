import { promisify } from 'node:util';
import {
	Body,
	Controller,
	forwardRef,
	Inject,
	Post,
	Req,
	UseFilters,
	UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { GuestOnly } from '#decorators/guest-only.decorator.js';
import { Public } from '#decorators/public.decorator.js';
import { HttpExceptionFilter } from '../../common/filters/http-exception.filter.js';
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
	@GuestOnly()
	@Post('signup')
	async signup(@Body() signupDto: SignupDto, @Req() req: Request) {
		const user = await this.authService.signup(signupDto);

		const login = promisify(req.login.bind(req));
		await login(user);

		// TODO: set Location response header
		return { data: user, message: 'Successfull!' };
	}

	@Public()
	@UseGuards(LocalAuthGuard)
	@GuestOnly()
	@Post('signin')
	async signin(@Req() req: Request) {
		const login = promisify(req.login.bind(req));
		await login(req.user);

		return { data: req.user, message: 'Successfull!' };
	}

	@Post('/logout')
	async logout(@Req() req: Request) {
		const logout = promisify(req.logout.bind(req));
		await logout();

		return { message: 'Successfull' };
	}
}
