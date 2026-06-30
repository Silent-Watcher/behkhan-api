import { Controller, forwardRef, Inject } from '@nestjs/common';
import { UserService } from './user.service.js';

@Controller('user')
export class UserController {
	constructor(
		@Inject(forwardRef(() => UserService))
		private readonly userService: UserService,
	) {}
}

console.log(Reflect.getMetadata('design:paramtypes', UserController));
