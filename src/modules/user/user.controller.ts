import { Controller, forwardRef, Get, Inject, Req } from '@nestjs/common';
import type { Request } from 'express';
import { UserService } from './user.service.js';

@Controller('users')
export class UserController {
	constructor(
		@Inject(forwardRef(() => UserService))
		private readonly userService: UserService,
	) {}

	@Get()
	whoami(@Req() req: Request) {
		return { data: req.user, message: 'current user' };
	}
}
