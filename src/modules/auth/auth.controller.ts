import { Body, Controller, forwardRef, Inject, Post } from '@nestjs/common';
import { AuthService } from './auth.service.js';
// biome-ignore lint/style/useImportType: <we need to emit some metadata for our dto>
import { SignupDto } from './dtos/signup.dto.js';

@Controller('auth')
export class AuthController {
	constructor(
		@Inject(forwardRef(() => AuthService))
		private readonly authService: AuthService,
	) {}

	@Post('signup')
	signup(@Body() signupDto: SignupDto) {
		return signupDto;
	}
}
