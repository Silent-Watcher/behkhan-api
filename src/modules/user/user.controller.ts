import { Controller, forwardRef, Get, Inject, Req } from '@nestjs/common';
import type { Request } from 'express';
import { UserService } from './user.service.js';

@Controller('users')
export class UserController {
	constructor(
		@Inject(forwardRef(() => UserService))
		private readonly userService: UserService,
	) {}

	@Get('/current')
	getCurrent(@Req() req: Request) {
		return { user: req.user, message: 'current user' };
	}
}
