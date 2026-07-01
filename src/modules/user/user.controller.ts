import { Controller, forwardRef, Get, Inject, Req } from '@nestjs/common';
import { UserService } from './user.service.js';
import type { Request } from 'express';

@Controller('user')
export class UserController {
	constructor(
		@Inject(forwardRef(() => UserService))
		private readonly userService: UserService,
	) {}

	@Get()
	whoami(@Req() req: Request) {
		return req.user;
	}
}
