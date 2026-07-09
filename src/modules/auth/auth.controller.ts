import {
	BadRequestException,
	Body,
	Controller,
	forwardRef,
	Get,
	Inject,
	InternalServerErrorException,
	Post,
	Req,
	UseGuards,
	Version,
	VERSION_NEUTRAL,
} from '@nestjs/common';
import type { Request } from 'express';
import { GuestOnly } from '#decorators/guest-only.decorator.js';
import { Public } from '#decorators/public.decorator.js';
import {
	loginUser,
	logoutUser,
	regenerateSession,
} from '#helpers/auth.helper.js';
import { AuthService } from './auth.service.js';
// biome-ignore lint/style/useImportType: <we need to emit some metadata for our dto>
import { SignupDto } from './dtos/signup.dto.js';
import { LocalAuthGuard } from './guards/local-auth.guard.js';
import { GoogleAuthGuard } from './guards/google-auth.guard.js';

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

		await regenerateSession(req);
		await loginUser(req, user);

		// TODO: set Location response header
		return { data: user, message: 'Successfull!' };
	}

	@Public()
	@UseGuards(LocalAuthGuard)
	@GuestOnly()
	@Post('signin')
	async signin(@Req() req: Request) {
		const user = req.user;

		if (!user)
			throw new InternalServerErrorException('something went wront');

		await regenerateSession(req);
		await loginUser(req, user);

		return { data: user, message: 'Successfull!' };
	}

	@Post('/logout')
	async logout(@Req() req: Request) {
		await logoutUser(req);
		return { message: 'Successfull' };
	}

	@Public()
	@Get('csrf')
	getCsrfToken(@Req() req: Request) {
		if (!req.csrfToken)
			throw new BadRequestException('service unavailable');
		const token = req.csrfToken();
		return { csrfToken: token };
	}

	@Public()
	@GuestOnly()
	@UseGuards(GoogleAuthGuard)
	@Version(VERSION_NEUTRAL)
	@Get('google')
	authenticateWithGoogleProvider() {}

	@UseGuards(GoogleAuthGuard)
	@Version(VERSION_NEUTRAL)
	@GuestOnly()
	@Public()
	@Get('google/callback')
	googleCallback(@Req() req: Request) {
		return { user: req.user, message: 'Successfull!' };
	}
}
