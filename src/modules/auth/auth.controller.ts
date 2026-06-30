import { Controller, forwardRef, Inject } from '@nestjs/common';
import { AuthService } from './auth.service.js';

@Controller('auth')
export class AuthController {
	constructor(
        @Inject(forwardRef(() => AuthService))
        private readonly authService: AuthService
    ) {}
}
