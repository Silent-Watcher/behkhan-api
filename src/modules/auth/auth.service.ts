import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UserService } from '#modules/user/user.service.js';

@Injectable()
export class AuthService {
	constructor(
		@Inject(forwardRef(() => UserService))
		private readonly userService: UserService,
	) {}

	async validateUserByUsernameAndPassword(
		username: string,
		password: string,
	) {
		const user =
			await this.userService.findOneByUsernameWithPassowrd(username);

		if (!user) {
			return null;
		}

		const { password: userHashPass, ...result } = user;

		// !check passord

		return result;
	}
}
