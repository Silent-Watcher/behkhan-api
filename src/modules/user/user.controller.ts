import { Controller, forwardRef, Get, Inject } from '@nestjs/common';
import { UserService } from './user.service.js';
import { User } from './user.decorator.js';
import type { UserEntity } from './user.entity.js';

@Controller('users')
export class UserController {
	constructor(
		@Inject(forwardRef(() => UserService))
		private readonly userService: UserService,
	) {}

	@Get('/current')
	getCurrent(@User() user: UserEntity) {
		return { user, message: 'current user' };
	}
}
