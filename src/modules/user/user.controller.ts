import {
	Controller,
	forwardRef,
	Get,
	Inject,
	Param,
	Patch,
} from '@nestjs/common';
import { UserByIdPipe } from './pipes/user-by-id.pipe.js';
import { User } from './user.decorator.js';
import type { UserEntity } from './user.entity.js';
import { UserService } from './user.service.js';

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

	@Patch(':id')
	patchOne(@Param('id', UserByIdPipe) user: UserEntity) {
		return user;
	}
}
